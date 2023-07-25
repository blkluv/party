import { clerkClient } from "@clerk/nextjs";
import { privateUserMetadataSchema } from "./userMetadataSchema";

export const getUser = async (id: string) => {
  const user = await clerkClient.users.getUser(id);

  if (!user) {
    return null;
  }

  const privateMetadata = privateUserMetadataSchema.safeParse(
    user.privateMetadata
  );

  if (!privateMetadata.success) {
    return null;
  }

  return { ...user, privateMetadata: privateMetadata.data };
};
