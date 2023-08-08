import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getUser } from "~/utils/getUser";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import type { PlatformRole } from "~/utils/userMetadataSchema";
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
});
