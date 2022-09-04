import { BaseRepository } from './base/BaseRepository'
import { GeneralEvent } from '../model/GeneralEvent'
import { Database } from 'firebase/database'

export class EventRepository extends BaseRepository<GeneralEvent> {
  constructor (db: Database) {
    super('events', db)
  }
}
