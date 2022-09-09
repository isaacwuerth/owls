import { atom } from 'recoil'
import { GeneralEvent } from '../model/GeneralEvent'
import { Participant } from '../model/Participant'

export const eventAtom = atom<GeneralEvent>({
  key: 'eventAtom'
})

export const participantsAtom = atom<Participant[]>({
  key: 'participantsAtom'
})
