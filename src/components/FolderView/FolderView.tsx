import { File, Folder } from '../../model/FileFolder'
import { DataGrid, GridCellParams } from '@mui/x-data-grid'
import { FolderViewFileRow } from './FolderViewFileRow'
import { FolderViewFolderRow } from './FolderViewFolderRow'
import { useEffect, useState } from 'react'
import { FolderViewRow } from './FolderViewRow'

export interface FolderViewProps {
  currentFolder: Folder
  onFolderClick: (folder: Folder) => void
  onFileClick: (file: File) => void
}

export function FolderView({
  currentFolder,
  onFolderClick,
  onFileClick,
}: FolderViewProps) {
  const [currentViewItem, setCurrentViewItem] = useState<FolderViewRow[]>([])

  const handleFolderClick = (item: FolderViewRow) => {
    if (item.folder) onFolderClick(item.folder)
    if (item.file) onFileClick(item.file)
  }

  useEffect(() => {
    setCurrentViewItem(buildFolderFileList(currentFolder))
  }, [currentFolder])

  function buildFolderFileList(folder: Folder): FolderViewRow[] {
    let counter = 0
    const files: FolderViewRow[] = folder.files.map((f) => ({
      id: counter++,
      file: f,
    }))
    const folders: FolderViewRow[] = folder.folders.map((f) => ({
      id: counter++,
      folder: f,
    }))
    return [...folders, ...files]
  }

  return (
    <DataGrid
      rows={currentViewItem}
      onRowClick={(params) => {
        handleFolderClick(params.row)
      }}
      columns={[
        {
          field: 'name',
          headerName: 'Name',
          flex: 1,
          renderCell: (params: GridCellParams) =>
            params.row.folder ? (
              <FolderViewFolderRow folder={params.row.folder} />
            ) : (
              <FolderViewFileRow file={params.row.file} />
            ),
        },
      ]}
    />
  )
}
