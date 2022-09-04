import { APIGatewayEvent, APIGatewayProxyResultV2, APIGatewayProxyEventPathParameters } from "aws-lambda";

type PathParameters = APIGatewayProxyEventPathParameters

interface Body {}

interface Query {}

/**
 * @method method
 * @description Description
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  try {
    console.log(event);

    const body = JSON.parse(event.body ?? "{}") as Body;
    const query = event.queryStringParameters as Query;
    const pathParams = event.pathParameters as PathParameters;
    const headers = event.headers;

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Code here
  }
};
