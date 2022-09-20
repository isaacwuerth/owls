import { FileOwls, FolderOwls } from '../../model/FileFolder'

export interface FolderViewRow {
  id: number
  file?: FileOwls
  folder?: FolderOwls
}
