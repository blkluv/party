import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "~/app/api/trpc/trpc-router";

export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});
