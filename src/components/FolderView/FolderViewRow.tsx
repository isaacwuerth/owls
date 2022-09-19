import { File, Folder } from '../../model/FileFolder'

export interface FolderViewRow {
  id: number
  file?: File
  folder?: Folder
}
