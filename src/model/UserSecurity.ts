import { z } from 'zod'
import { BasicEntitySchema } from '../repositories/base/BaseRepository'

export const UserSecuritySchema = z
  .object({
    uid: z.string(),
    description: z.array(z.string()),
    lastPermissionUpdate: z.date(),
  })
  .merge(BasicEntitySchema)

export type UserSecurity = z.infer<typeof UserSecuritySchema>
