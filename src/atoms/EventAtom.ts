import { atom } from 'recoil'
import { GeneralEvent, Participant } from '../model/GeneralEvent'

export const eventAtom = atom<GeneralEvent>({
  key: 'eventAtom'
})

export const participantsAtom = atom<Participant[]>({
  key: 'participantsAtom'
})
