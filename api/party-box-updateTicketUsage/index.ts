import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, decodeJwt, PartyBoxEventTicket } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

interface Body {
  value: boolean;
}

/**
 * @method POST
 * @description Create ticket within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { stage } = event.requestContext;
  const { value } = JSON.parse(event.body ?? "{}") as Body;
  const { ticketId } = event.pathParameters as PathParameters;
  const { Authorization } = event.headers;

  const pg = await getPostgresClient(stage);

  try {
    decodeJwt(Authorization, ["admin"]);

    await pg<PartyBoxEventTicket>("tickets").where("id", ticketId).update({ used: value });

    return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error }) };
  } finally {
    await pg.destroy();
  }
};
