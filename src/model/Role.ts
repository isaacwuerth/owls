import { z } from 'zod'
import { BasicEntitySchema } from '../repositories/base/BaseRepository'

export const Subjects = [
  'all',
  'events',
  'users',
  'eventparticipants',
  'roles',
  'files',
] as const
export const SubjectSchema = z.enum(Subjects)
export type Subject = z.infer<typeof SubjectSchema>

export const Scopes = ['all', 'own', 'none'] as const
export const ScopeSchema = z.enum(Scopes)
export type Scope = z.infer<typeof ScopeSchema>

export const Actions = [
  'list',
  'get',
  'update',
  'create',
  'delete',
  'manage',
] as const
export const ActionSchema = z.enum(Actions)
export type Action = z.infer<typeof ActionSchema>

export const CapabilitySchema = z.object({
  subject: SubjectSchema,
  scope: ScopeSchema,
  action: ActionSchema,
})

export type Capability = z.infer<typeof CapabilitySchema>

export const RoleSchema = z
  .object({
    friendlyName: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Only numbers and letters are allowed'),
    description: z.string().optional(),
    capabilities: z.array(CapabilitySchema),
  })
  .merge(BasicEntitySchema)

export type Role = z.infer<typeof RoleSchema>
