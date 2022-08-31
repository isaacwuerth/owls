// that class only can be extended
import { IWrite } from '../interfaces/IWrite'
import { IRead } from '../interfaces/IRead'
import { addDoc, collection, getDocs } from 'firebase/firestore'

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  name: string
  db: any

  constructor (name: string, db: any) {
    this.name = name
    this.db = db
  }

  async create (item: T): Promise<string> {
    const obj = JSON.parse(JSON.stringify(item))
    const docRef = await addDoc(collection(this.db, this.name), obj)
    return docRef.id
  }

  async update (id: string, item: T): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async delete (id: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async find (item?: T): Promise<T[]> {
    const docs = await getDocs(collection(this.db, this.name))
    // @ts-expect-error
    return docs.docs
  }

  async findOne (id: string): Promise<T> {
    throw new Error('Method not implemented.')
  }
}
