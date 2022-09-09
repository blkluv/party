import knex from "knex";
import getPostgresCredentials from "./getPostgresCredentials";

const getPostgresClient = async (stage: string) => {
  const credentials = await getPostgresCredentials(stage);

  const pg = knex({
    client: "pg",
    connection: credentials,
  });

  return pg;
};

export default getPostgresClient;
