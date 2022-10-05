import { atom } from 'recoil'
import { LocalStorage, storageEffect } from './effects/StorageEffect'

export const requestedRouteAtom = atom<string | null>({
  key: 'requestedRouteAtom',
  default: null,
  effects: [storageEffect('requestedRoute', new LocalStorage())],
})
