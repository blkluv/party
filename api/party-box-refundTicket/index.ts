import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";

/**
 * @method method
 * @description Description
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  try {
    console.log(event);

    // const body = JSON.parse(event.body ?? "{}") as Body;
    // const query = event.queryStringParameters as Query;
    // const pathParams = event.pathParameters as PathParameters;
    const headers = event.headers;

    await new Promise((resolve) => {
      resolve({
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello World",
        }),
      });
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Hello World",
      }),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Code here
  }
};
