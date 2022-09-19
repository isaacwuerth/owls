import { File } from '../../model/FileFolder'
import { Box } from '@mui/system'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { Typography } from '@mui/material'

interface FolderViewFileRowProps {
  file: File
}

export function FolderViewFileRow({ file }: FolderViewFileRowProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <InsertDriveFileIcon fontSize="large" />
      <Box sx={{ ml: 1 }}>
        <Typography color="textPrimary" variant="body1">
          {file.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          Size: {String(file.size)}
        </Typography>
      </Box>
    </Box>
  )
}
