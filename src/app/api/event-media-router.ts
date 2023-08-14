import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import type { EventMedia } from "~/db/schema";

import { eventMedia, insertEventMediaSchema } from "~/db/schema";
import { createUploadUrls, deleteImage } from "~/utils/images";
import { adminEventProcedure, router } from "./trpc/trpc-config";

export const eventMediaRouter = router({
  createUploadUrls: adminEventProcedure
    .input(z.object({ count: z.number().gt(0) }))
    .mutation(async ({ input }) => {
      const urls = await createUploadUrls(input.count);
      return urls;
    }),
  createEventMedia: adminEventProcedure
    .input(
      z.object({
        media: insertEventMediaSchema
          .pick({
            isPoster: true,
            order: true,
            eventId: true,
            url: true,
            imageId: true,
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const media = await ctx.db
        .insert(eventMedia)
        .values(
          input.media.map((e) => ({
            ...e,
            userId: ctx.auth.userId,
            id: createId(),
          }))
        )
        .returning()
        .get();

      return media;
    }),
  deleteEventMedia: adminEventProcedure
    .input(
      z.object({
        ids: insertEventMediaSchema
          .pick({
            id: true,
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.ids.length === 0) {
        return [];
      }

      const deletedMedia = await ctx.db
        .delete(eventMedia)
        .where(
          inArray(
            eventMedia.id,
            input.ids.map((e) => e.id)
          )
        )
        .returning()
        .all();

      await Promise.all(deletedMedia.map((e) => deleteImage(e.imageId)));

      return deletedMedia;
    }),
  updateEventMedia: adminEventProcedure
    .input(
      z.object({
        media: insertEventMediaSchema
          .pick({
            id: true,
            isPoster: true,
            order: true,
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.media.length === 0) {
        return [];
      }

      const updatedMedia: EventMedia[] = [];
      for (const e of input.media) {
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
