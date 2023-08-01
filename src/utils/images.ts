import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { DEFAULT_EVENT_IMAGE } from "~/config/default-image";
import { env } from "~/config/env";

const createImageUrlResponseSchema = z.object({
  result: z.object({
    id: z.string(),
    uploadURL: z.string(),
  }),
  success: z.boolean(),
  errors: z.array(z.unknown()),
  messages: z.array(z.unknown()),
});

export const createUploadUrls = async (count: number) => {
  if (count === 0) {
    return [];
  }

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${env.CLOUDFLARE_IMAGES_API_KEY}`);

  const urls = await Promise.all(
    Array.from({ length: count }).map(async () => {
      const form = new FormData();
      const id = nanoid();
      form.append("id", nanoid());
      form.append("expiry", dayjs().add(5, "minute").toISOString());

      const imgRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
        { method: "POST", headers, body: form }
      ).then((res) => res.json());

      const res = createImageUrlResponseSchema.safeParse(imgRes);

      if (!res.success) {
        throw new Error(res.error.message);
      }

      return { url: res.data.result.uploadURL, id };
    })
  );

  return urls;
};

export const deleteImage = async (id: string) => {
  if (id === DEFAULT_EVENT_IMAGE.id) {
    return { success: true };
  }

  try {
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${env.CLOUDFLARE_IMAGES_API_KEY}`);

    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${id}`,
      { method: "POST", headers }
    ).then((res) => res.json());
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};
