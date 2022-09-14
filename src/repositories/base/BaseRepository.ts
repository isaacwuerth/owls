// that class only can be extended
import { IWrite } from '../interfaces/IWrite'
import { IRead } from '../interfaces/IRead'
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  SnapshotOptions,
  Timestamp,
  Unsubscribe,
  updateDoc,
  WithFieldValue,
} from 'firebase/firestore'
import { z } from 'zod'

const removeNullUndefined = (obj: any) => {
  const objFiltered = { ...obj }
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      objFiltered[key] = deleteField()
    }
  })

  return objFiltered
}

export const BasicEntitySchema = z.object({
  id: z.string().nullable().default(null).optional(),
  createdAt: z
    .date()
    .or(z.custom<Timestamp>())
    .nullable()
    .default(null)
    .optional(),
  updatedAt: z
    .date()
    .or(z.custom<Timestamp>())
    .nullable()
    .default(null)
    .optional(),
})

export type BasicEntity = z.infer<typeof BasicEntitySchema>

function TimestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate()
}

function DateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}

function IterateOverObjectAndConvertTimestampToDate(obj: any): any {
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const element = obj[key]
      if (element instanceof Timestamp) {
        obj[key] = TimestampToDate(element)
      }
    }
  }
  return obj
}

function IterateOverObjectAndConvertDateToTimestamp(obj: any): any {
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const element = obj[key]
      if (element instanceof Date) {
        obj[key] = DateToTimestamp(element)
      }
    }
  }
  return obj
}

export abstract class BaseRepository<T extends BasicEntity>
  implements IWrite<T>, IRead<T>
{
  collectionName: string
  db: Firestore

  constructor(name: string, database: Firestore) {
    this.collectionName = name
    this.db = database
  }

  async create(item: T): Promise<string> {
    const createItem = BasicEntitySchema.passthrough().parse(item)
    createItem.createdAt = serverTimestamp() as Timestamp
    createItem.updatedAt = serverTimestamp() as Timestamp
    const itemRef = doc(collection(this.db, this.collectionName)).withConverter(
      this.postConverter
    )
    createItem.id = itemRef.id
    return await setDoc(itemRef, createItem).then(() => itemRef.id)
  }

  async createFromArray(items: T[]): Promise<any> {
    const functions: any[] = []
    for (const item of items) {
      functions.push(this.create(item))
    }
    return await Promise.all(functions)
  }

  async update(id: string, newItem: T): Promise<string> {
    newItem.updatedAt = serverTimestamp() as Timestamp
    newItem.id = id
    delete newItem.createdAt
    const filtered = removeNullUndefined(newItem)
    const docRef = doc(this.db, `${this.collectionName}/${id}`).withConverter(
      this.postConverter
    )
    return await updateDoc(docRef, filtered).then(() => id)
  }

  async delete(id: string): Promise<string> {
    const docRef = doc(this.db, `${this.collectionName}/${id}`)
    return await deleteDoc(docRef).then(() => id)
  }

  async findOne(id: string): Promise<T> {
    const docRef = doc(this.db, `${this.collectionName}/${id}`).withConverter(
      this.postConverter
    )
    return await getDoc(docRef).then((value) => value.data() as T)
  }

  async findAll(): Promise<T[]> {
    const ref = collection(this.db, this.collectionName).withConverter(
      this.postConverter
    )
    return await getDocs(ref).then((value) =>
      value.docs.map((doc) => doc.data() as T)
    )
  }

  onDocUpdate(id: string, callback: (doc: T) => void): Unsubscribe {
    const docRef = doc(this.db, `${this.collectionName}/${id}`).withConverter(
      this.postConverter
    )
    return onSnapshot(docRef, (doc) => {
      const enity = doc.data() as T
      callback(enity)
    })
  }

  onCollectionUpdate(callback: (docs: T[]) => void): Unsubscribe {
    const ref = collection(this.db, this.collectionName).withConverter(
      this.postConverter
    )
    return onSnapshot(ref, (docs) => {
      const entities = docs.docs.map((doc) => doc.data() as T)
      callback(entities)
    })
  }

  postConverter = {
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      return IterateOverObjectAndConvertDateToTimestamp(modelObject)
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot<DocumentData>,
      options?: SnapshotOptions
    ): T {
      return IterateOverObjectAndConvertTimestampToDate(
        snapshot.data(options)
      ) as T
    },
  }
}
