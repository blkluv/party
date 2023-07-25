import { z } from "zod";

export const platformRoleSchema = z.enum(["admin", "user"]);
export type PlatformRole = z.infer<typeof platformRoleSchema>;

export const privateUserMetadataSchema = z.object({
  platformRole: platformRoleSchema.catch("user"),
});

export type PrivateUserMetadata = z.infer<typeof privateUserMetadataSchema>;
