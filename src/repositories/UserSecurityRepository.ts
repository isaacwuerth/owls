import { BaseRepository } from './base/BaseRepository'
import { Firestore } from 'firebase/firestore'
import { UserSecurity } from '../model/UserSecurity'

export class UserSecurityRepository extends BaseRepository<UserSecurity> {
  constructor(db: Firestore) {
    super('capabilitiesUsers', db)
  }
}
