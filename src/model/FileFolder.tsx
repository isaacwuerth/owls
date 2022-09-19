export interface Parent {
  parent?: Parent
}

export interface Folder extends Parent {
  id?: number
  name: string
  fullPath: string
  files: File[]
  folders: Folder[]
}

export interface File extends Parent {
  fullPath: string
  name: string
  size: number
  timeCreated: Date
  updated: Date
}
