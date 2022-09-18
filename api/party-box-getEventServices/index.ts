import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient } from "@party-box/common";

/**
 * @method GET
 * @description Returns all event services
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { stage } = event.requestContext;

  const sql = await getPostgresClient(stage);

  try {
    const eventServices = await sql`
      SELECT * FROM "eventServices";
    `;

    return { statusCode: 200, body: JSON.stringify(eventServices) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await sql.end();
  }
};
