import { APIGatewayProxyEventPathParameters, APIGatewayProxyHandler } from "aws-lambda";
import { getPostgresClient, decodeJwt, PartyBoxHost, verifyHostRoles } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

/**
 * Update a host entity within Postgres
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;
  const { hostId } = event.pathParameters as PathParameters;

  const sql = await getPostgresClient(stage);

  try {
    if (!event.body) throw new Error("Missing event body");

    const { name, description, imageUrl } = JSON.parse(event.body);

    const { sub: userId } = decodeJwt(Authorization, ["admin", "user"]);
    if (!userId) throw new Error("User ID missing.");

    // Check whether the user is an admin/manager of the host.
    const validRole = await verifyHostRoles(sql, userId, Number(hostId), ["admin", "manager"]);
    if (!validRole) throw new Error("User is not permitted to update this host.");

    const [newHostData] = await sql<PartyBoxHost[]>`
      UPDATE "hosts" SET
      ${sql({
        name,
        description,
        imageUrl,
      })}
      WHERE "id" = ${Number(hostId)}
      RETURNING *;
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
  } finally {
    await sql.end();
  }
};
