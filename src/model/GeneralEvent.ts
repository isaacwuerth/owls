import { ParticipantState } from '../enum/ParticipantState'
import firebase from 'firebase/compat/app'
import Timestamp = firebase.firestore.Timestamp

export interface Participant {
  id: string
  eid: string
  uid: string
  state: ParticipantState
  fullname: string
}

export interface GeneralEvent {
  id: string
  title: string
  start: Timestamp
  end: Timestamp
}
