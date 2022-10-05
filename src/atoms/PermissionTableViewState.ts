import { atom } from 'recoil'
import { LocalStorage, storageEffect } from './effects/StorageEffect'
import { z } from 'zod'

export const permissionTableViews = ['vertical', 'horizontal'] as const
const permissionTableViewsSchema = z.enum(permissionTableViews)
type permissionTableViewType = z.infer<typeof permissionTableViewsSchema>
export const permissionTableViewState = atom<permissionTableViewType>({
  key: 'permissionTableViewState',
  default: 'vertical',
  effects: [storageEffect('permissionTableViewState', new LocalStorage())],
})
