import { BaseRepository } from './base/BaseRepository'
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { Profile } from '../model/Profil'

export class UsersRepository extends BaseRepository<Profile> {
  constructor(db: Firestore) {
    super('users', db)
  }

  async findByUID(uid: string) {
    const ref = collection(this.db, this.collectionName).withConverter(
      this.postConverter
    )
    const q = query(ref, where('uid', '==', uid))
    return await getDocs(q).then((value) => value.docs.map((doc) => doc.data()))
  }
}
