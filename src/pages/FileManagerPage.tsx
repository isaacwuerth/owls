import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  LinearProgressProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { useSearchParams } from 'react-router-dom'
import { FolderTree } from '../components/FolderTree/FolderTree'
import { FileOwls, FolderOwls } from '../model/FileFolder'
import { FolderView } from '../components/FolderView/FolderView'
import { useFirebase } from '../Context/FirebaseContext'
import { Loading } from '../common/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { DropzoneDialog } from '../common/dropzone/DropzoneDialog'
import { ProtectedRoute } from '../Context/AuthorizationContext'

function helperGetFolderFromPath(
  folder: FolderOwls,
  path: string[]
): FolderOwls {
  if (path.length === 0) {
    return folder
  }
  for (const subFolder of folder.folders) {
    if (subFolder.name === path[0]) {
      return helperGetFolderFromPath(subFolder, path.slice(1))
    }
  }
  throw new Error('Folder not found')
}

function getFolderFromPath(rootFolder: FolderOwls, path: string): FolderOwls {
  path = path.trim().replace(/^\/+/, '').replace(/\/+$/, '').replace(/\/+/, '/')
  const pathArray = path.split('/')
  if (pathArray.length === 1) return rootFolder
  return helperGetFolderFromPath(rootFolder, pathArray.slice(1))
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

interface DownloadDialogProps {
  fileName: string
  procentage: number
  open: boolean
}

function DownloadDialog({ fileName, procentage, open }: DownloadDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog fullScreen={fullScreen} open={open}>
      <DialogTitle>Download {fileName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={procentage} />
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export function FileManagerPageInner() {
  const [search, setSearch] = useSearchParams()
  const [currentFolder, setCurrentFolder] = useState<FolderOwls | undefined>()
  const [rootFolder, setRootFolder] = useState<FolderOwls | undefined>(
    undefined
  )
  const [presentageCompleted, setPrecentCompleted] = useState<number>(0)
  const [downloadName, setDownloadName] = useState<string>('')
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [openUpload, setOpenUpload] = useState(false)
  const { filesRepository } = useFirebase()

  const handleFolderClick = (folder: FolderOwls) => {
    setCurrentFolder(folder)
    setSearch({ path: folder.fullPath })
  }

  const handleFileClick = async (file: FileOwls) => {
    const relativePath = filesRepository.createRelativePath(file.fullPath)
    const downloadUrl = await filesRepository.getDownloadUrl(relativePath)
    setDownloadName(file.name)
    setPrecentCompleted(0)
    setDownloadDialogOpen(true)
    await axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        setPrecentCompleted(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        )
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', file.name) // or any other extension
        document.body.appendChild(link)
        link.click()
        setDownloadDialogOpen(false)
      })
      .catch(() => {
        return []
      })
  }

  const handleFolderDelete = async (folder: FolderOwls) => {
    try {
      await filesRepository.delete(
        filesRepository.createRelativePath(folder.fullPath)
      )
      toast(`Deleted Folder ${folder.name}`, { type: 'success' })
    } catch {
      toast(`Failed to delete folder ${folder.name}`, { type: 'error' })
    }
  }

  const handleFileDelete = async (file: FileOwls) => {
    try {
      await filesRepository.delete(
        filesRepository.createRelativePath(file.fullPath)
      )
      toast(`Deleted File ${file.name}`, { type: 'success' })
    } catch {
      toast(`Failed to delete file ${file.name}`, { type: 'error' })
    }
  }

  useEffect(() => {
    const path = search.get('path')
    if (!path || !rootFolder) return
    setCurrentFolder(getFolderFromPath(rootFolder, path))
  }, [rootFolder])

  useEffect(() => {
    filesRepository
      .list()
      .then((folder) => {
        setRootFolder(folder)
        setCurrentFolder(folder)
      })
      .catch(console.error)
  }, [])

  const handleUpload = (files: File[]) => {
    setOpenUpload(false)
    files.forEach(async (file) => {
      await filesRepository.upload(file.name, file)
    })
    toast('Upload all files', { type: 'success' })
  }

  if (!currentFolder || !rootFolder) return <Loading />
  return (
    <Box style={{ marginTop: 20, marginRight: 20 }}>
      <Typography>{currentFolder.fullPath}</Typography>
      <DropzoneDialog onSave={handleUpload} open={openUpload} />
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Card>
            <CardHeader title={'Hierarchie'} />
            <CardContent style={{ height: 600 }}>
              <FolderTree
                folderRoot={rootFolder}
                currentFolder={currentFolder}
                onFolderClick={handleFolderClick}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card>
            <CardHeader
              title={'Dateien'}
              action={
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => setOpenUpload(true)}
                >
                  Hochladen
                </Button>
              }
            />
            <CardContent style={{ height: 600 }}>
              <FolderView
                currentFolder={currentFolder}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
                onFolderDelete={handleFolderDelete}
                onFileDelete={handleFileDelete}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <DownloadDialog
        fileName={downloadName}
        procentage={presentageCompleted}
        open={downloadDialogOpen}
      />
    </Box>
  )
}

export function FileManagerPage() {
  return (
    <ProtectedRoute subject="files">
      <FileManagerPageInner />
    </ProtectedRoute>
  )
}
