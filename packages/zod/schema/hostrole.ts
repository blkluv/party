import * as z from "zod"
import { CompleteHost, RelatedHostModel, CompleteUser, RelatedUserModel } from "./index"

export const HostRoleModel = z.object({
  hostId: z.number().int(),
  userId: z.string(),
  role: z.string(),
})

export interface CompleteHostRole extends z.infer<typeof HostRoleModel> {
  host: CompleteHost
  user: CompleteUser
}

/**
 * RelatedHostRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedHostRoleModel: z.ZodSchema<CompleteHostRole> = z.lazy(() => HostRoleModel.extend({
  host: RelatedHostModel,
  user: RelatedUserModel,
}))
