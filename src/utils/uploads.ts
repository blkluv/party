"use client";

import { useCallback } from "react";
import { z } from "zod";
import { trpc } from "./trpc";

const uploadResponseSchema = z.object({
  result: z.object({
    id: z.string(),
    filename: z.string(),
    uploaded: z.string(),
    requireSignedURLs: z.boolean(),
    variants: z.string().array(),
  }),
  success: z.boolean(),
  errors: z.unknown().array(),
  messages: z.unknown().array(),
});

export const useUploadImages = () => {
  const { mutateAsync: getUploadUrls } =
    trpc.events.media.createUploadUrls.useMutation();

  const upload = useCallback(
    async (args: { files: File[]; eventId: string }) => {
      const urls = await getUploadUrls({
        count: args.files.length,
        eventId: args.eventId,
      });

      return await Promise.all(
        args.files.map(async (f, i) => {
          const formData = new FormData();
          formData.append("file", f);

          const fetchResponse = await fetch(urls[i].url, {
            method: "POST",
            body: formData,
          }).then((res) => res.json());

          const uploadImageResponse =
            uploadResponseSchema.safeParse(fetchResponse);

          if (!uploadImageResponse.success) {
            throw new Error("Failed to upload image");
          }

          return {
            url: uploadImageResponse.data.result.variants[0],
            id: urls[i].id,
          };
        })
      );
    },
    [getUploadUrls]
  );

  return upload;
};
