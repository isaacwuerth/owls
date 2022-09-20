import { ImageList, ImageListItem, useTheme } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'

interface DropzonePreviewProps {
  files: Array<File & { preview: string }>
  setFiles: (files: Array<File & { preview: string }>) => void
}

export function DropzonePreview({ files, setFiles }: DropzonePreviewProps) {
  const theme = useTheme()
  const removeFileFromList = (file: File) => {
    const newFiles = files.filter((f) => f.name !== file.name)
    setFiles(newFiles)
  }
  return (
    <ImageList
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(auto-fill,minmax(100px,2fr)) !important',
        gridAutoColumns: 'minmax(100px,1fr)',
        gridGap: '1rem !important',
        overflow: 'scroll',
      }}
    >
      {files.map((file, index) => (
        <ImageListItem
          key={index}
          sx={{
            position: 'relative',
          }}
        >
          <img
            src={file.preview}
            alt={file.name}
            style={{ position: 'relative', width: '100px', height: '100px' }}
            onLoad={() => {
              URL.revokeObjectURL(file.preview)
            }}
          />

          <IconButton
            sx={{
              color: theme.palette.error.main,
              position: 'absolute',
              top: 2,
              right: 2,
              width: '25px',
              height: '25px',
            }}
            onClick={() => removeFileFromList(file)}
          >
            <CancelIcon />
          </IconButton>
        </ImageListItem>
      ))}
    </ImageList>
  )
}
