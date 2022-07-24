import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

interface Body {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxTickets: string;
  media: string[];
  thumbnail: string;
  published: boolean;
  stripeProductId: string;
  snsTopicArn: string;
  prices: {
    price: number;
    name: string;
  }[];
  ticketPrice: number;
  hashtags: string[];
  notifications: {
    days: number;
    hours: number;
    minutes: number;
    message: string;
  }[];
}

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method POST
 * @description Update event in Dynamo and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const secretsManager = new SecretsManager({});
  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    const body = JSON.parse(event.body ?? "{}") as Body;
    const { eventId } = event.pathParameters as PathParameters;
    const { Authorization } = event.headers;
    const { stage } = event.requestContext;

    if (!Authorization) throw new Error("Authorization header was undefined.");

    const auth = jwt.decode(Authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);

    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const { Item: previousEventData } = await dynamo.get({
      TableName: `${stage}-party-box-events`,
      Key: {
        id: eventId,
      },
    });

    const newEventData = {
      ...previousEventData,
      ...body,
    };

    console.log(newEventData);

    // Update event in Dynamo
    const { Attributes: eventData } = await dynamo.update({
      TableName: `${stage}-party-box-events`,
      Key: {
        id: eventId,
      },
      UpdateExpression: `
        SET 
          #name = :name,
          #description = :description,
          #startTime = :startTime,
          #endTime = :endTime,
          #location = :location,
          #maxTickets = :maxTickets,
          #ticketPrice = :ticketPrice,
          #media = :media,
          #thumbnail = :thumbnail,
          #published = :published
        `,
      ExpressionAttributeValues: {
        ":name": newEventData.name,
        ":description": newEventData.description,
        ":startTime": newEventData.startTime,
        ":endTime": newEventData.endTime,
        ":location": newEventData.location,
        ":maxTickets": newEventData.maxTickets,
        ":ticketPrice": newEventData.ticketPrice,
        ":media": newEventData.media,
        ":thumbnail": newEventData.thumbnail,
        ":published": newEventData.published,
      },
      ExpressionAttributeNames: {
        "#name": "name",
        "#description": "description",
        "#startTime": "startTime",
        "#endTime": "endTime",
        "#location": "location",
        "#maxTickets": "maxTickets",
        "#ticketPrice": "ticketPrice",
        "#media": "media",
        "#thumbnail": "thumbnail",
        "#published": "published",
      },
      ReturnValues: "ALL_NEW",
    });

    await stripeClient.products.update(newEventData.stripeProductId, {
      name: body.name,
      description: body.description,
      images: newEventData.media,
    });

    const { Items: oldNotifications = [] } = await dynamo.scan({
      TableName: "party-box-event-notifications",
      FilterExpression: "eventId = :eventId",
      ExpressionAttributeValues: {
        ":eventId": eventId,
      },
    });

    // Delete notifications from DynamoDB
    for (const e of oldNotifications) {
      await dynamo.delete({
        TableName: "party-box-event-notifications",
        Key: {
          id: e.id,
        },
      });
    }

    for (const n of newEventData.notifications) {
      // Schedule some messages
      await dynamo.put({
        TableName: "party-box-event-notifications",
        Item: {
          id: uuid(),
          eventId,
          messageTime: dayjs(newEventData.startTime)
            .subtract(n.days, "day")
            .subtract(n.hours, "hour")
            .subtract(n.minutes, "minute")
            .toISOString(),
          message: n.message
            .replace("{location}", newEventData.location)
            .replace("{startTime}", newEventData.startTime)
            .replace("{name}", newEventData.name),
          eventSnsTopicArn: newEventData.snsTopicArn,
        },
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(eventData),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
