import { atom } from 'recoil'
import { Profile } from '../model/Profil'

export const editUserAtom = atom<Profile | undefined>({
  key: 'editUserAtom',
  default: undefined,
})
