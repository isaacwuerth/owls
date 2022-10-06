import { BaseRepository } from './base/BaseRepository'
import { Firestore } from 'firebase/firestore'
import { UserContext } from '../model/UserContext'

export class UserContextRepository extends BaseRepository<UserContext> {
  constructor(db: Firestore) {
    super('userContext', db)
  }
}
