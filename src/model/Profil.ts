import { BasicEntitySchema } from '../repositories/base/BaseRepository'
import { z } from 'zod'

export const ProfileCreateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  eMail: z.string(),
  photoURL: z.string().optional(),
  birthday: z.date().nullable().default(null).optional(),
  homephone: z.string().optional(),
  mobilephone: z.string().optional(),
  street: z.string().optional(),
  postcode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional()
})

export type ProfileCreate = z.infer<typeof ProfileCreateSchema>

export const ProfileSchema = ProfileCreateSchema
  .merge(BasicEntitySchema)
  .extend({ uid: z.string() })

export type Profile = z.infer<typeof ProfileSchema>
