import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresClient, PartyBoxHost } from "@party-box/common";

/**
 * Create a host entity within Postgres and add the creator as an admin
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const sql = await getPostgresClient(stage);

  try {
    if (!event.body) throw new Error("Missing event body");

    const { name, description } = JSON.parse(event.body);

    const { sub: userId } = decodeJwt(Authorization, ["host"]);
    if (!userId) throw new Error("Missing userId");

    const [newHostData] = await sql<PartyBoxHost[]>`
      insert into "hosts" ${sql({
        name,
        description,
        createdBy: userId,
      })}
      returning *;
    `;

    await sql`
      insert into "hostRoles" ${sql({
        userId,
        hostId: newHostData.id,
        role: "admin",
      })}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(newHostData),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }finally{
    await sql.end();
  }
};
