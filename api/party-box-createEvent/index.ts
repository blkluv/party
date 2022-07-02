import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import stripe from "stripe";

interface Body {
  name: string;
  description: string;
  start_time: string;
  end_time?: string;
  location: string;
  owner_id: string;
  max_tickets: string;
  ticket_price: number;
  poster: {
    name: string;
    type: string;
    alt_text: string;
    data: FormData;
  };
  images: {
    name: string;
    type: string;
    alt_text: string;
    data: FormData;
  }[];
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  console.log(event);
  const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });

  // Get postgres login
  const { SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/postgres" });
  if (!SecretString) throw new Error("Postgres login string was undefined.");
  const { username: user, password, host, port, dbname } = JSON.parse(SecretString);

  const client = new Client({
    user,
    password,
    host,
    port,
    database: dbname,
  });

  await client.connect();

  try {
    const {
      name,
      description,
      start_time,
      end_time,
      location,
      owner_id,
      max_tickets,
      images = [],
      poster,
      ticket_price,
    } = JSON.parse(event.body ?? "{}") as Body;
    // const headers = event.headers;

    const imageUrls: string[] = [];

    // Get access keys for S3 login
    const { SecretString: s3SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/access-keys" });
    if (!s3SecretString) throw new Error("Access keys string was undefined.");
    const { accessKeyId, secretAccessKey } = JSON.parse(s3SecretString);
    const s3 = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: "party-box/stripe",
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    // Create stripe product
    const stripeProduct = await stripeClient.products.create({
      name,
      default_price_data: {
        currency: "CAD",
        unit_amount: ticket_price,
      },
    });

    // Create event in pg without poster (we'll update after)
    const { rows } = await client.query(
      "insert into events(name,description,start_time,end_time,max_tickets,location,owner_id,stripe_product_id) values($1,$2,$3,$4,$5,$6,$7,$8) returning *;",
      [name, description, start_time, end_time, max_tickets, location, owner_id, stripeProduct.id]
    );

    const eventData = rows[0];

    const bucketPath = `events/${eventData.id}`;

    // Upload poster
    const posterPath = `${bucketPath}/${uuid()}-${poster.name}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: "party-box-bucket",
        Key: posterPath,
        Body: "poster.data",
      })
    );

    const { rows: insertPosterResult } = await client.query(
      `insert into media(name,type,alt_text,url) values($1,$2,$3,$4) returning id;`,
      [poster.name, "image", poster.alt_text, `https://party-box-bucket.s3.amazonaws.com/${posterPath}`]
    );
    const posterId = insertPosterResult[0].id;

    // Update event with poster id
    await client.query(
      `
      update event 
      where id = $1
      set poster_id = $2;
    `,
      [eventData.id, posterId]
    );

    for (const image of images) {
      const imagePath = `${bucketPath}/${uuid()}-${image.name}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: "party-box-bucket",
          Key: imagePath,
          Body: image.data.data,
        })
      );
      const imageUrl = `https://party-box-bucket.s3.amazonaws.com/${imagePath}`;
      await client.query(`insert into media(name,type,alt_text,url) values($1,$2,$3,$4);`, [
        image.name,
        "image",
        image.alt_text,
        imageUrl,
      ]);

      imageUrls.push(imageUrl);
    }

    await stripeClient.products.update(stripeProduct.id, {
      images: imageUrls,
    });

    return {
      ...eventData,
      poster: {
        url: `https://party-box-bucket.s3.amazonaws.com/${posterPath}`,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
