import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresClient } from "@party-box/common";

/**
 * Get hosts that a user has relationships with
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const sql = await getPostgresClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization);
    if (!userId) throw new Error("Missing userId");

    const records = await sql`
      SELECT
        "hostRoles"."role",
        "hosts"."id",
        "hosts"."name",
        "hosts"."description",
        "hosts"."imageUrl"
      FROM "hosts"
      INNER JOIN "hostRoles" ON "hostRoles"."hostId" = "hosts"."id"
      WHERE "hostRoles"."userId" = ${userId}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(records),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
