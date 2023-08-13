import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import type { EventMedia } from "~/db/schema";

import { eventMedia, insertEventMediaSchema } from "~/db/schema";
import { createUploadUrls, deleteImage } from "~/utils/images";
import { protectedProcedure, router } from "./trpc/trpc-config";

export const eventMediaRouter = router({
  createUploadUrls: protectedProcedure
    .input(z.object({ count: z.number().gt(0) }))
    .mutation(async ({ input }) => {
      const urls = await createUploadUrls(input.count);
      return urls;
    }),
  createEventMedia: protectedProcedure
    .input(
      insertEventMediaSchema
        .pick({
          isPoster: true,
          order: true,
          eventId: true,
          url: true,
          imageId: true,
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      const media = await ctx.db
        .insert(eventMedia)
        .values(
          input.map((e) => ({ ...e, userId: ctx.auth.userId, id: createId() }))
        )
        .returning()
        .get();

      return media;
    }),
  deleteEventMedia: protectedProcedure
    .input(
      insertEventMediaSchema
        .pick({
          id: true,
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      if (input.length === 0) {
        return [];
      }

      const deletedMedia = await ctx.db
        .delete(eventMedia)
        .where(
          and(
            inArray(
              eventMedia.id,
              input.map((e) => e.id)
            ),
            eq(eventMedia.userId, ctx.auth.userId)
          )
        )
        .returning()
        .all();

      await Promise.all(deletedMedia.map((e) => deleteImage(e.imageId)));

      return deletedMedia;
    }),
  updateEventMedia: protectedProcedure
    .input(
      insertEventMediaSchema
        .pick({
          id: true,
          isPoster: true,
          order: true,
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      if (input.length === 0) {
        return [];
      }

      const updatedMedia: EventMedia[] = [];
      for (const e of input) {
        const m = await ctx.db
          .update(eventMedia)
          .set({ isPoster: e.isPoster, order: e.order })
          .where(
            and(eq(eventMedia.id, e.id), eq(eventMedia.userId, ctx.auth.userId))
          )
          .returning()
          .get();

        updatedMedia.push(m);
      }

      return updatedMedia;
    }),
});
