import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { DropzoneArea } from './DropzoneArea'
import { DropzonePreview } from './DropzonePreview'

interface DropzoneDialogProps {
  open: boolean
  onSave: (files: File[]) => void
}

export function DropzoneDialog({ onSave, open }: DropzoneDialogProps) {
  const theme = useTheme()
  const [files, setFiles] = useState<Array<File & { preview: string }>>([])
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const handleSave = () => {
    onSave(files)
  }

  return (
    <Dialog open={open} fullScreen={fullScreen}>
      <DialogTitle title={'Dateien hochladen'} />
      <DialogContent>
        <DropzoneArea setFiles={setFiles} />
        <DropzonePreview files={files} setFiles={setFiles} />
      </DialogContent>
      <DialogActions>
        <Divider />
        <Button autoFocus onClick={handleSave}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
}
