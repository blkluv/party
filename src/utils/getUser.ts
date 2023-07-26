import { clerkClient } from "@clerk/nextjs";
import { publicUserMetadataSchema } from "./userMetadataSchema";

export const getUser = async (id: string) => {
  const user = await clerkClient.users.getUser(id);

  if (!user) {
    return null;
  }

  const publicMetadata = publicUserMetadataSchema.safeParse(
    user.privateMetadata
  );

  if (!publicMetadata.success) {
    return null;
  }

  return { ...user, privateMetadata: publicMetadata.data };
};
