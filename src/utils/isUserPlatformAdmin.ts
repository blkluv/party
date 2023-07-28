import { auth, clerkClient } from "@clerk/nextjs";
import { publicUserMetadataSchema } from "./userMetadataSchema";

/**
 * SERVER ONLY
 */
export const isUserPlatformAdmin = async () => {
  const userAuth = auth();

  if (!userAuth.userId) {
    return false;
  }

  const user = await clerkClient.users.getUser(userAuth.userId);

  const publicMetadata = publicUserMetadataSchema.safeParse(
    user.publicMetadata
  );

  // If the user is an admin, they are always allowed to view tickets
  // If not, the user needs to own the ticket
  let isAdmin = false;
  if (publicMetadata.success && publicMetadata.data.platformRole === "admin") {
    isAdmin = true;
  }

  return isAdmin;
};
