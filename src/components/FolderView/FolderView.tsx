import { FileOwls, FolderOwls } from '../../model/FileFolder'
import { DataGrid, GridCellParams } from '@mui/x-data-grid'
import { FolderViewFileRow } from './FolderViewFileRow'
import { FolderViewFolderRow } from './FolderViewFolderRow'
import React, { useEffect, useState } from 'react'
import { FolderViewRow } from './FolderViewRow'
import IconButton from '@mui/material/IconButton'
import MoreIcon from '@mui/icons-material/MoreVert'
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export interface FolderViewProps {
  currentFolder: FolderOwls
  onFolderClick: (folder: FolderOwls) => void
  onFileClick: (file: FileOwls) => void
  onFolderDelete: (folder: FolderOwls) => void
  onFileDelete: (file: FileOwls) => void
}

export function FolderView({
  currentFolder,
  onFolderClick,
  onFileClick,
  onFileDelete,
  onFolderDelete,
}: FolderViewProps) {
  const [currentViewItem, setCurrentViewItem] = useState<FolderViewRow[]>([])

  const handleFolderClick = (item: FolderViewRow) => {
    if (item.folder) onFolderClick(item.folder)
    if (item.file) onFileClick(item.file)
  }

  useEffect(() => {
    setCurrentViewItem(buildFolderFileList(currentFolder))
  }, [currentFolder])

  function buildFolderFileList(folder: FolderOwls): FolderViewRow[] {
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
      onCellClick={(params) => {
        if (params.field !== 'name') return
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
        {
          field: 'actions',
          headerName: '',
          width: 60,
          sortable: false,
          renderCell: (params: GridCellParams) => (
            <Action
              row={params.row}
              onFileDelete={onFileDelete}
              onFolderDelete={onFolderDelete}
            />
          ),
        },
      ]}
    />
  )
}

interface ActionProp {
  row: FolderViewRow
  onFileDelete: (file: FileOwls) => void
  onFolderDelete: (folder: FolderOwls) => void
}

function Action({ row, onFileDelete, onFolderDelete }: ActionProp) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleDelete = () => {
    if (row.folder) onFolderDelete(row.folder)
    if (row.file) onFileDelete(row.file)
    handleCloseUserMenu()
  }
  return (
    <>
      <IconButton color="inherit" onClick={handleOpenUserMenu}>
        <MoreIcon />
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          key={`folderview-item-${row.id}-delete`}
          onClick={handleDelete}
          disabled={Boolean(row.folder)}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Löschen
        </MenuItem>
      </Menu>
    </>
  )
}
