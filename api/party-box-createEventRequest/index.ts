import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { PublishCommand, SNS } from "@aws-sdk/client-sns";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  // console.log(event);
  const body = JSON.parse(event.body ?? "{}");
  const { stage } = event.requestContext;

  const sns = new SNS({});

  try {
    if (!body) throw new Error("No body provided");

    // Forward body to email
    await sns.send(
      new PublishCommand({
        Message: JSON.stringify(body, null, 2),
        TopicArn: `arn:aws:sns:us-east-1:356466505463:${stage}-event-requests`,
      })
    );

    return { statusCode: 201, body: JSON.stringify({}) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
