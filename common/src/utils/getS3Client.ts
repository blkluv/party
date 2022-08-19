import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { S3Client } from "@aws-sdk/client-s3";

const getS3Client = async () => {
  const secretsManager = new SecretsManager({});

  // Get access keys for S3 login
  const { SecretString: s3SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/access-keys" });
  if (!s3SecretString) throw new Error("Access keys string was undefined.");
  const { accessKeyId, secretAccessKey } = JSON.parse(s3SecretString);

  const s3 = new S3Client({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3;
};

export default getS3Client;