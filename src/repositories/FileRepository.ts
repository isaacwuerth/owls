import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  ListResult,
} from 'firebase/storage'
import { Folder } from '../model/FileFolder'

export class FileRepository {
  name: string = ''
  basePath: string = ''
  storage: FirebaseStorage

  constructor(storage: FirebaseStorage, basePath: string = '') {
    this.name = basePath
    this.basePath = basePath ? basePath + '/' : ''
    this.storage = storage
  }

  async upload(path: string, file: File, metadata: any = {}) {
    const fileRef = this.createRef(path)
    const meta = {
      ...metadata,
    }
    await uploadBytes(fileRef, file, meta)
  }

  async getDownloadUrl(path: string) {
    return await getDownloadURL(this.createRef(path))
  }

  async delete(path: string) {
    await deleteObject(this.createRef(path))
  }

  public createRelativePath(fullPath: string) {
    return fullPath.replace(new RegExp(`^${this.basePath}`), '')
  }

  async list(path?: string): Promise<Folder> {
    // const metadata = await getMetadata(this.createRef(path ?? ''))
    const res = await listAll(this.createRef(path ?? ''))
    return this.convertItemToFolder(res)
  }

  private convertItemToFolder(item: ListResult): Folder {
    const folder: Folder = {
      name: this.basePath.split('/')[0],
      fullPath: this.basePath,
      files: [],
      folders: [],
    }
    folder.folders = item.prefixes.map((prefix) => {
      return {
        name: prefix.name,
        fullPath: prefix.fullPath,
        files: [],
        folders: [],
      }
    })
    folder.files = item.items.map((item) => {
      return {
        name: item.name,
        fullPath: item.fullPath,
        updated: new Date(),
        size: 0,
        timeCreated: new Date(),
      }
    })

    return folder
  }

  private createRef(path: string) {
    return ref(this.storage, `${this.basePath}${path}`)
  }
}
