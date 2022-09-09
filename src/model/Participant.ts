import { BasicEntity } from '../repositories/base/BaseRepository'
import { ParticipantState } from '../enum/ParticipantState'

export interface Participant extends BasicEntity {
  eid: string
  uid: string
  state: ParticipantState
  fullname: string
}
