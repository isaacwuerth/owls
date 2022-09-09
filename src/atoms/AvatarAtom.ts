import { atom } from 'recoil'

interface Avatar {
  filename: string
  dowloadUrl: string
}

export const avatarAtom = atom<Avatar | null>({
  key: 'avatarAtom',
  default: null
})
