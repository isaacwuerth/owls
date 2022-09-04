// that class only can be extended
import { IWrite } from '../interfaces/IWrite'
import { IRead } from '../interfaces/IRead'
import { Database } from 'firebase/database'

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  name: string
  db: Database

  constructor (name: string, db: Database) {
    this.name = name
    this.db = db
  }

  async create (item: T): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async update (id: string, item: T): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async delete (id: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async find (item?: T): Promise<T[]> {
    throw new Error('Method not implemented.')
  }

  async findOne (id: string): Promise<T> {
    throw new Error('Method not implemented.')
  }
}
