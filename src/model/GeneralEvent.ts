import { Person } from './Person'
import { ParticipantState } from '../enum/ParticipantState'

export interface Participant {
  id: number
  person: Person
  state: ParticipantState
}

export interface GeneralEvent {
  id?: number
  title: string
  start: Date
  end: Date
  participants: Participant[]
}
