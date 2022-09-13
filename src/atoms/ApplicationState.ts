import { atom } from 'recoil'

export const applicationStateAtom = atom<'loading' | 'running'>({
  key: 'applicationStateAtom',
  default: 'loading'
})
