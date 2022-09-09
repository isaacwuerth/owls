import { BasicEntitySchema } from '../repositories/base/BaseRepository'
import { z } from 'zod'

export const LocationSchema = z.object({
  postcode: z.string(),
  city: z.string(),
  street: z.string(),
  country: z.string()
})

export const GeneralEventSchema = z.object({
  title: z.string(),
  start: z.date(),
  end: z.date()
}).merge(BasicEntitySchema)
  .merge(LocationSchema.partial())

export type GeneralEvent = z.infer<typeof GeneralEventSchema>
