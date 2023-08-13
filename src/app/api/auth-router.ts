import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getUser } from "~/utils/getUser";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import {
  publicUserMetadataSchema,
  type PlatformRole,
} from "~/utils/userMetadataSchema";
import { protectedProcedure, router } from "./trpc/trpc-config";

export const authRouter = router({
  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const data = await getUser(input.userId);

      const admin = await isUserPlatformAdmin(data);

      if (data === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }
      return {
        name: `${data.firstName} ${data.lastName}`,
        id: data.id,
        imageUrl: data.imageUrl,
        role: (admin ? "admin" : "user") as PlatformRole,
      };
    }),
  searchUsers: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const users = await clerkClient.users.getUserList({ query: input.query });

      return users.map((e) => {
        const meta = publicUserMetadataSchema.safeParse(e.publicMetadata);

        const admin = meta.success && meta.data.platformRole === "admin";

        return {
          id: e.id,
          name: `${e.firstName} ${e.lastName}`,
          role: (admin ? "admin" : "user") as PlatformRole,
          imageUrl: e.imageUrl,
        };
      });
    }),
});
