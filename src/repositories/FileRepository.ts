import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage'

export class FileRepository {
  basePath: string = ''
  storage: FirebaseStorage

  constructor(storage: FirebaseStorage, basePath: string = '') {
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

  private createRef(path: string) {
    return ref(this.storage, `${this.basePath}${path}`)
  }
}
