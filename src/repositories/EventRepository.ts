import { BaseRepository } from './base/BaseRepository'
import { GeneralEvent } from '../model/GeneralEvent'
import { Firestore } from 'firebase/firestore'

export class EventRepository extends BaseRepository<GeneralEvent> {
  constructor(db: Firestore) {
    super('events', db)
  }
}
