export interface Parent {
  parent?: Parent
}

export interface FolderOwls extends Parent {
  id?: number
  name: string
  fullPath: string
  files: FileOwls[]
  folders: FolderOwls[]
}

export interface FileOwls extends Parent {
  fullPath: string
  name: string
  size: number
  timeCreated: Date
  updated: Date
}
