import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresConnectionString, getPostgresClient, PartyBoxCreateServiceInput, } from "@party-box/common";

/**
 * @method POST
 * @description Create a new event service
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { name, description, price, imageUrl } = JSON.parse(event.body ?? "{}") as PartyBoxCreateServiceInput;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const connectionString = await getPostgresConnectionString(stage);
  const sql = await getPostgresClient(connectionString);

  try {
    const { sub } = decodeJwt(Authorization, ["admin"]);
    if (!sub) throw new Error("Missing sub");

    const [newServiceData] = await sql`
      INSERT INTO "services" ${sql({ name, description, price, imageUrl })}
      RETURNING *
    `;

    return { statusCode: 201, body: JSON.stringify(newServiceData) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await sql.end();
  }
};
