import { z } from 'zod'

export const SiteConfigSchema = z.object({
  name: z.string(),
  logoUrl: z.string(),
  maintenanceMode: z.enum(['permanent', 'off', 'scheduled']),
  maintenanceTitle: z.string(),
  maintenanceMessage: z.string(),
  maintenanceEnd: z.preprocess(
    (a) => new Date(a as string),
    z.date().optional()
  ),
})

export type SiteConfig = z.infer<typeof SiteConfigSchema>
