import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import TreeView from '@mui/lab/TreeView'
import { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Grid from '@mui/material/Unstable_Grid2'
import FolderIcon from '@mui/icons-material/Folder'
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { styled } from '@mui/material/styles'
import { DataGrid, GridCellParams } from '@mui/x-data-grid'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string
    '--tree-view-bg-color'?: string
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string
  color?: string
  labelIcon: React.ElementType<SvgIconProps>
  labelInfo?: string
  labelText: string
}

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
    // paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 10,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: 10,
    },
  },
}))

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 'inherit', flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  )
}

interface Parent {
  parent?: Parent
}

interface Folder extends Parent {
  id: number
  name: string
  fullPath: string
  files: File[]
  folders: Folder[]
}

interface File extends Parent {
  bucket: string
  generation: string
  fullPath: string
  name: string
  size: number
  timeCreated: Date
  updated: Date
}

// Create sample list with some folders and files
// Github bot will do this now
const folder: Folder = {
  id: 1,
  name: 'avatar',
  fullPath: '/avatar',
  files: [
    {
      bucket: 'bucket',
      generation: 'G1',
      fullPath: '/avatar/1.png',
      name: '1.png',
      size: 100,
      timeCreated: new Date(),
      updated: new Date(),
    },
    {
      bucket: 'bucket',
      generation: 'G1',
      fullPath: '/avatar/2.png',
      name: '2.png',
      size: 100,
      timeCreated: new Date(),
      updated: new Date(),
    },
    {
      bucket: 'bucket',
      generation: 'G1',
      fullPath: '/avatar/2.png',
      name: '3.png',
      size: 100,
      timeCreated: new Date(),
      updated: new Date(),
    },
  ],
  folders: [
    {
      id: 2,
      name: 'folder1',
      fullPath: '/avatar/folder1',
      files: [
        {
          bucket: 'bucket',
          generation: 'G1',
          fullPath: '/avatar/folder1/2.png',
          name: '2.png',
          size: 100,
          timeCreated: new Date(),
          updated: new Date(),
        },
        {
          bucket: 'bucket',
          generation: 'G1',
          fullPath: '/avatar/folder1/2.png',
          name: '3.png',
          size: 100,
          timeCreated: new Date(),
          updated: new Date(),
        },
      ],
      folders: [],
    },
    {
      id: 3,
      name: 'folder2',
      fullPath: '/avatar/folder2',
      files: [
        {
          bucket: 'bucket',
          generation: 'G1',
          fullPath: '/avatar/folder2/2.png',
          name: '2.png',
          size: 100,
          timeCreated: new Date(),
          updated: new Date(),
        },
        {
          bucket: 'bucket',
          generation: 'G1',
          fullPath: '/avatar/folder2/2.png',
          name: '3.png',
          size: 100,
          timeCreated: new Date(),
          updated: new Date(),
        },
      ],
      folders: [
        {
          id: 4,
          name: 'folder1',
          fullPath: '/avatar/folder2/folder1',
          files: [
            {
              bucket: 'bucket',
              generation: 'G1',
              fullPath: '/avatar/folder2/folder1/2.png',
              name: '2.png',
              size: 100,
              timeCreated: new Date(),
              updated: new Date(),
            },
            {
              bucket: 'bucket',
              generation: 'G1',
              fullPath: '/avatar/folder2/folder1/2.png',
              name: '3.png',
              size: 100,
              timeCreated: new Date(),
              updated: new Date(),
            },
          ],
          folders: [],
        },
        {
          id: 5,
          name: 'folder2',
          fullPath: '/avatar/folder2/folder2',
          files: [
            {
              bucket: 'bucket',
              generation: 'G1',
              fullPath: '/avatar/folder2/folder2/2.png',
              name: '2.png',
              size: 100,
              timeCreated: new Date(),
              updated: new Date(),
            },
            {
              bucket: 'bucket',
              generation: 'G1',
              fullPath: '/avatar/folder2/folder2/2.png',
              name: '3.png',
              size: 100,
              timeCreated: new Date(),
              updated: new Date(),
            },
          ],
          folders: [],
        },
      ],
    },
  ],
}

const setParent = function (child: Parent, parent: Parent) {
  child.parent = parent
}

const setAllParents = function (rootFolder: Folder) {
  rootFolder.files.forEach((file) => setParent(file, rootFolder))
  rootFolder.folders.forEach((folder) => {
    setParent(folder, rootFolder)
    setAllParents(folder)
  })
}

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
  if (path[0] === '/') path = path.slice(1)
  if (path[-1] === '/') path = path.slice(0, -1)
  if (path === '') return rootFolder
  const pathArray = path.split('/')
  if (pathArray.length === 1) return rootFolder
  return helperGetFolderFromPath(rootFolder, pathArray.slice(1))
}

interface FileFolder {
  id: number
  name: string
  folder: boolean
  fullPath: string
  size?: number
  folderCount?: number
  fileCount?: number
  timeCreated?: Date
  updated?: Date
}

function buildFolderFileList(folder: Folder): FileFolder[] {
  let counter = 0
  const files: FileFolder[] = folder.files.map((f) => ({
    id: counter++,
    name: f.name,
    folder: false,
    size: f.size,
    timeCreated: f.timeCreated,
    updated: f.updated,
    fullPath: f.fullPath,
  }))
  const folders: FileFolder[] = folder.folders.map((f) => ({
    id: counter++,
    name: f.name,
    folder: true,
    folderCount: f.folders.length,
    fileCount: f.files.length,
    fullPath: f.fullPath,
  }))
  return [...folders, ...files]
}

interface FileFolderListProps {
  folder: Folder
}

function TreeViewFromFolder({ folder }: FileFolderListProps) {
  return (
    <StyledTreeItem
      key={folder.id}
      nodeId={String(folder.id)}
      labelText={folder.name}
      labelIcon={FolderIcon}
      color="#1a73e8"
      bgColor="#e8f0fe"
    >
      {folder.folders.map((f) => (
        <TreeViewFromFolder key={f.id} folder={f} />
      ))}
    </StyledTreeItem>
  )
}

interface FileFolderRowProps {
  item: FileFolder
}

function FolderRow({ item }: FileFolderRowProps) {
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
          {item.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          Folders: {String(item.folderCount)}, Files: {String(item.fileCount)}
        </Typography>
      </Box>
    </Box>
  )
}

function FileRow({ item }: FileFolderRowProps) {
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
          {item.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          Size: {String(item.size)}
        </Typography>
      </Box>
    </Box>
  )
}

function getMapFromFolder(rootFolder: Folder): Map<number, Folder> {
  let map = new Map<number, Folder>()
  map.set(rootFolder.id, rootFolder)
  for (const folder of rootFolder.folders) {
    map.set(folder.id, folder)
    const subMap = getMapFromFolder(folder)
    map = new Map<number, Folder>([...map, ...subMap])
  }
  return map
}

export function FileManagerPage() {
  const [expanded, setExpanded] = useState<string[]>(['3'])
  const [selected, setSelected] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [currentFolderView, setCurrentFolderView] = useState<FileFolder[]>(
    buildFolderFileList(getFolderFromPath(folder, currentPath))
  )
  const [searchIndex] = useState<Map<number, Folder>>(
    getMapFromFolder(getFolderFromPath(folder, currentPath))
  )

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  const handleExpandClick = () => {
    setExpanded((oldExpanded) => (oldExpanded.length === 0 ? ['1'] : []))
  }

  const setExpanendFromPath = (path: Folder) => {
    setExpanded((oldExpanded) => [...oldExpanded, String(path.id)])
    if (!path?.parent) return
    setExpanendFromPath(path.parent as Folder)
  }

  const handleFolderClick = (item: FileFolder) => {
    if (item.folder) {
      const selectedFolder = getFolderFromPath(folder, item.fullPath)
      setCurrentPath(selectedFolder.fullPath)
      setSelected([String(selectedFolder.id)])

      setExpanendFromPath(selectedFolder)
      setCurrentFolderView(buildFolderFileList(selectedFolder))
    }
  }

  useEffect(() => {
    const folder = searchIndex.get(Number(selected[0]))
    if (!folder) return
    setCurrentPath(folder.fullPath)
    setCurrentFolderView(buildFolderFileList(folder))
  }, [selected])

  useEffect(() => {
    setAllParents(folder)
  }, [])

  return (
    <Box style={{ marginTop: 20, marginRight: 20 }}>
      <Typography>{currentPath}</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Card>
            <CardHeader title={'Hierarchie'} />
            <CardContent>
              <Box sx={{ mb: 1 }}>
                <Button onClick={handleExpandClick}>
                  {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                </Button>
              </Box>
              <TreeView
                aria-label="controlled"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                selected={selected}
                expanded={expanded}
                onNodeSelect={(_: any, nodeIds: string[]) => {
                  setSelected(nodeIds)
                }}
                onNodeToggle={handleToggle}
              >
                <TreeViewFromFolder folder={folder} />
              </TreeView>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card>
            <CardContent style={{ height: 600 }}>
              <DataGrid
                rows={currentFolderView}
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
                        <FolderRow item={params.row} />
                      ) : (
                        <FileRow item={params.row} />
                      ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
