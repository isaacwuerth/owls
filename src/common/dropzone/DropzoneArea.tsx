import { Button, useTheme } from '@mui/material'
import Dropzone from 'react-dropzone'
import Paper from '@mui/material/Paper'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface DropzoneAreaProps {
  setFiles: (files: Array<File & { preview: string }>) => void
}

export function DropzoneArea({ setFiles }: DropzoneAreaProps) {
  const theme = useTheme()

  const baseStyle = {
    backgroundColor: theme.palette.grey['50'],
    color: theme.palette.grey['400'],
    padding: theme.spacing(2),
    cursor: 'pointer',
    transition: 'border .24s ease-in-out',
    border: 'dashed',
    boxShadow: 'none',
    zIndex: 100000,
  }
  const isFocusedStyle = { borderColor: theme.palette.info.main }
  const isDragAcceptStyle = { borderColor: theme.palette.info.main }
  const isDragRejectStyle = { borderColor: theme.palette.error.main }
  const isDragActiveStyle = { borderColor: theme.palette.success.main }
  const isFileDialogActiveStyle = { borderColor: theme.palette.warning.main }

  return (
    <Dropzone
      onDropAccepted={(acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        )
      }}
    >
      {({
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragActive,
        isDragReject,
        isFileDialogActive,
        open,
      }) => (
        <Paper
          {...getRootProps({
            className: 'dropzone',
            style: {
              ...baseStyle,
              ...(isFocused ? isFocusedStyle : {}),
              ...(isDragAccept ? isDragAcceptStyle : {}),
              ...(isDragActive ? isDragActiveStyle : {}),
              ...(isDragReject ? isDragRejectStyle : {}),
              ...(isFileDialogActive ? isFileDialogActiveStyle : {}),
            },
          })}
        >
          <div style={{ textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p>
              Ziehen Sie einige Dateien hierher,
              <br />
              oder klicken Sie, um Dateien auszuwählen
            </p>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={open}
            >
              Hochladen
            </Button>
          </div>
        </Paper>
      )}
    </Dropzone>
  )
}
