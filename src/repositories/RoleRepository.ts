import { BaseRepository, BasicEntitySchema } from './base/BaseRepository'
import {
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { Role } from '../model/Role'

export class RoleRepository extends BaseRepository<Role> {
  constructor(db: Firestore) {
    super('capabilitiesRoles', db)
  }

  async create(item: Role): Promise<string> {
    const createItem = BasicEntitySchema.passthrough().parse(item)
    createItem.createdAt = serverTimestamp() as Timestamp
    createItem.updatedAt = serverTimestamp() as Timestamp
    const id = createItem.id as string
    const docRef = doc(this.db, `${this.collectionName}/${id}`).withConverter(
      this.postConverter
    )
    return await setDoc(docRef, createItem).then(() => id)
  }
}
