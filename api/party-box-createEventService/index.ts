import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, decodeJwt, PartyBoxCreateServiceInput, PartyBoxService } from "@party-box/common";

/**
 * @method POST
 * @description Create a new event service
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  
  const { name, description, price, imageUrl } = JSON.parse(event.body ?? "{}") as PartyBoxCreateServiceInput;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const pg = await getPostgresClient(stage);

  try {
    const { sub } = decodeJwt(Authorization, ["admin"]);
    if (!sub) throw new Error("Missing sub");

    const [newServiceData] = await pg<PartyBoxService>("services")
      .insert({
        name,
        description,
        price,
        imageUrl,
      })
      .returning("*");

    return { statusCode: 201, body: JSON.stringify(newServiceData) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await pg.destroy();
  }
};
