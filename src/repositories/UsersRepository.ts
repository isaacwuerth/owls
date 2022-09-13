import { BaseRepository } from './base/BaseRepository'
import { Firestore } from 'firebase/firestore'
import { ProfilModel } from '../model/ProfilModel'

export class UsersRepository extends BaseRepository<ProfilModel> {
  constructor (db: Firestore) {
    super('users', db)
  }
}
