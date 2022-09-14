import { BaseRepository } from './base/BaseRepository'
import { collection, Firestore, getDocs, onSnapshot, query, Unsubscribe, where } from 'firebase/firestore'
import { ParticipantState } from '../model/enum/ParticipantState'
import { Participant } from '../model/Participant'

export class ParticipantRepository extends BaseRepository<Participant> {
  constructor (db: Firestore) {
    super('eventparticipants', db)
  }

  async findByEvent (eid: string): Promise<Participant[]> {
    const q = query(collection(this.db, this.collectionName), where('eid', '==', eid))
    return await getDocs(q).then(value => value.docs.map(doc => doc.data() as Participant))
  }

  async findByUser (uid: string): Promise<Participant[]> {
    const q = query(collection(this.db, this.collectionName), where('uid', '==', uid))
    return await getDocs(q).then(value => value.docs.map(doc => doc.data() as Participant))
  }

  async findByEventAndUser (eid: string, uid: string): Promise<Participant[]> {
    const q = query(collection(this.db, this.collectionName), where('eid', '==', eid), where('uid', '==', uid))
    return await getDocs(q).then(value => value.docs.map(doc => doc.data() as Participant))
  }

  async findByEventAndState (eid: string, state: string): Promise<Participant[]> {
    const q = query(collection(this.db, this.collectionName), where('eid', '==', eid), where('state', '==', state))
    return await getDocs(q).then(value => value.docs.map(doc => doc.data() as Participant))
  }

  async findByUserAndState (uid: string, state: string): Promise<Participant[]> {
    const q = query(collection(this.db, this.collectionName), where('uid', '==', uid), where('state', '==', state))
    return await getDocs(q).then(value => value.docs.map(doc => doc.data() as Participant))
  }

  async updateUserState (eid: string, uid: string, state: ParticipantState): Promise<string> {
    const participants = await this.findByEventAndUser(eid, uid)
    if (participants.length > 0) {
      const participant = participants[0]
      participant.state = state
      return await this.update(participant.id as string, participant)
    } else {
      return ''
    }
  }

  onEventParticipantsChange (eid: string, callback: (participants: Participant[]) => void): Unsubscribe {
    const q = query(collection(this.db, this.collectionName), where('eid', '==', eid))
    return onSnapshot(q, snapshot => {
      callback(snapshot.docs.map(doc => doc.data() as Participant))
    })
  }
}
