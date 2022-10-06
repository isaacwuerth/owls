import { z } from 'zod'
import { BasicEntitySchema } from '../repositories/base/BaseRepository'

export const UserContextSchema = z
  .object({
    uid: z.string(),
    lastPermissionUpdate: z.date(),
  })
  .merge(BasicEntitySchema)

export type UserContext = z.infer<typeof UserContextSchema>
