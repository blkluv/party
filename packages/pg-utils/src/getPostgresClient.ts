import pg from "postgres";
import getPostgresCredentials from "./getPostgresCredentials";

/**
 * Get a Postgres client
 * @param stage Usually "dev" or "prod"
 * @returns The new Postgres client
 */
const getPostgresClient = async (stage: string) => {
  const credentials = await getPostgresCredentials(stage);

  const db = pg(credentials);

  return db;
};
export default getPostgresClient;
