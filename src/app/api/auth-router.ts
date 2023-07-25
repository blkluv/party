import { getUser } from "~/utils/getUser";
import { protectedProcedure, router } from "./trpc/trpc-config";

export const authRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const data = await getUser(ctx.auth.userId);
    return data;
  }),
});
