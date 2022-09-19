import {
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { useSearchParams } from 'react-router-dom'
import { FolderTree } from '../components/FolderTree/FolderTree'
import { File, Folder } from '../model/FileFolder'
import { FolderView } from '../components/FolderView/FolderView'
import { useFirebase } from '../Context/FirebaseContext'
import { Loading } from '../common/Loading'
import axios from 'axios'

function helperGetFolderFromPath(folder: Folder, path: string[]): Folder {
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

function getFolderFromPath(rootFolder: Folder, path: string): Folder {
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

export function FileManagerPage() {
  const [search, setSearch] = useSearchParams()
  const [currentFolder, setCurrentFolder] = useState<Folder | undefined>(
    undefined
  )
  const [rootFolder, setRootFolder] = useState<Folder | undefined>(undefined)
  const [presentageCompleted, setPrecentCompleted] = useState<number>(0)
  const { filesRepository } = useFirebase()

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolder(folder)
    setSearch({ path: folder.fullPath })
  }

  const handleFileClick = async (file: File) => {
    const relativePath = filesRepository.createRelativePath(file.fullPath)
    const downloadUrl = await filesRepository.getDownloadUrl(relativePath)
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
      })
      .catch(() => {
        return []
      })
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

  if (!currentFolder || !rootFolder) return <Loading />
  return (
    <Box style={{ marginTop: 20, marginRight: 20 }}>
      <Typography>{currentFolder.fullPath}</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={12}>
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={presentageCompleted} />
          </Box>
        </Grid>
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
            <CardHeader title={'Dateien'} />
            <CardContent style={{ height: 600 }}>
              <FolderView
                currentFolder={currentFolder}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
