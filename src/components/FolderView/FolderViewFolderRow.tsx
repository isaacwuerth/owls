import { FolderOwls } from '../../model/FileFolder'
import { Box } from '@mui/system'
import FolderIcon from '@mui/icons-material/Folder'
import { Typography } from '@mui/material'

interface FolderViewFolderRowProps {
  folder: FolderOwls
}

export function FolderViewFolderRow({ folder }: FolderViewFolderRowProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <FolderIcon fontSize="large" />
      <Box sx={{ ml: 1 }}>
        <Typography color="textPrimary" variant="body1">
          {folder.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          Folders: {String(folder.folders.length)}, Files:{' '}
          {String(folder.files.length)}
        </Typography>
      </Box>
    </Box>
  )
}
