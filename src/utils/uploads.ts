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
    async (files: File[]) => {
      const urls = await getUploadUrls({ count: files.length });

      return await Promise.all(
        files.map(async (f, i) => {
          const formData = new FormData();
          formData.append("file", f);
          const uploadImageResponse = uploadResponseSchema.safeParse(
            await fetch(urls[i], {
              method: "POST",
              body: formData,
            }).then((res) => res.json())
          );

          if (!uploadImageResponse.success) {
            throw new Error("Failed to upload image");
          }

          return uploadImageResponse.data.result.variants[0];
        })
      );
    },
    [getUploadUrls]
  );

  return upload;
};
