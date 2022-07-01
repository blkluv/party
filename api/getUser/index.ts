import {
  APIGatewayEvent,
  APIGatewayProxyResultV2,
  APIGatewayProxyEventPathParameters,
} from "aws-lambda";
import {
  DynamoDBClient,
  BatchExecuteStatementCommand,
  TransactWriteItem,
} from "@aws-sdk/client-dynamodb";

interface PathParameters extends APIGatewayProxyEventPathParameters {}

interface Body {}

interface Query {}

/**
 * @method method
 * @description Description
 */
export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResultV2<{ message: string }>> => {
  try {
    const client = new DynamoDBClient({ region: "us-east-1" });
    await client.send(
      new BatchExecuteStatementCommand({
        Statements: [
          {
            Statement: `INSERT INTO "Music" value {'Artist':'?','SongTitle':'?'}`,
            Parameters: [{ S: "Acme Band" }, { S: "Best Song" }],
          },
        ],
      })
    );
    console.log(event);

    const body = JSON.parse(event.body ?? "{}") as Body;
    const query = event.queryStringParameters as Query;
    const pathParams = event.pathParameters as PathParameters;
    const headers = event.headers;

    return { message: "Success" };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Code here
  }
};
