import { z } from "zod";

export const platformRoleSchema = z.enum(["admin", "user"]);
export type PlatformRole = z.infer<typeof platformRoleSchema>;

export const publicUserMetadataSchema = z.object({
  platformRole: platformRoleSchema.catch("user"),
});

export type PublicUserMetadata = z.infer<typeof publicUserMetadataSchema>;
