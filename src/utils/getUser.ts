import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { publicUserMetadataSchema } from "./userMetadataSchema";

export const getUser = async (id: string) => {
  const user = await clerkClient.users.getUser(id);

  return formatUser(user);
};

export const getUsers = async (ids: string[]) => {
  const users = await clerkClient.users.getUserList({ userId: ids });

  return users
    .map((user) => formatUser(user))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
};

export const formatUser = (user: User) => {
  const publicMetadata = publicUserMetadataSchema.safeParse(
    user.publicMetadata
  );

  if (!publicMetadata.success) {
    return null;
  }

  return { ...user, publicMetadata: publicMetadata.data };
};
