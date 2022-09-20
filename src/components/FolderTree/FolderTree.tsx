import { SyntheticEvent, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Button } from '@mui/material'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { FolderOwls, Parent } from '../../model/FileFolder'
import { FolderTreeRecursive } from './FolderTreeItem'
import { Loading } from '../../common/Loading'

interface FolderTreeProps {
  folderRoot: FolderOwls
  onFolderClick: (folder: FolderOwls) => void
  currentFolder: FolderOwls
}

export function FolderTree({
  folderRoot,
  onFolderClick,
  currentFolder,
}: FolderTreeProps) {
  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [searchIndex, setSearchIndex] = useState<Map<number, FolderOwls>>(
    new Map()
  )
  const [loading, setLoading] = useState(true)

  const setExpanendFolder = (folder: FolderOwls) => {
    setExpanded((oldExpanded) => [...oldExpanded, String(folder.id)])
    if (!folder?.parent) return
    setExpanendFolder(folder.parent as FolderOwls)
  }

  function CreateIndex(rootFolder: FolderOwls): Map<number, FolderOwls> {
    let map = new Map<number, FolderOwls>()
    if (!rootFolder.id) return map
    map.set(rootFolder.id, rootFolder)
    for (const folder of rootFolder.folders) {
      if (!folder.id) break
      map.set(folder.id, folder)
      const subMap = CreateIndex(folder)
      map = new Map<number, FolderOwls>([...map, ...subMap])
    }
    return map
  }

  const setParent = function (child: Parent, parent: Parent) {
    child.parent = parent
  }
  const setAllParents = function (rootFolder: FolderOwls) {
    rootFolder.files.forEach((file) => setParent(file, rootFolder))
    rootFolder.folders.forEach((folder) => {
      setParent(folder, rootFolder)
      setAllParents(folder)
    })
  }

  const setIds = (folder: FolderOwls, id: number) => {
    folder.id = id
    folder.folders.forEach((f) => setIds(f, ++id))
  }

  useEffect(() => {
    setExpanendFolder(currentFolder)
    setSelected([String(currentFolder.id)])
  }, [currentFolder])

  useEffect(() => {
    setLoading(true)
    setIds(folderRoot, 1)
    setAllParents(folderRoot)
    setSearchIndex(CreateIndex(folderRoot))
    setLoading(false)
  }, [folderRoot])

  const handleExpandClick = () => {
    if (expanded.length !== 0) setExpanded([])

    function setExpandedAll(folder: FolderOwls) {
      setExpanded((oldExpanded) => [...oldExpanded, String(folder.id)])
      folder.folders
        .filter((folder) => folder.folders.length !== 0)
        .forEach(setExpandedAll)
    }

    setExpandedAll(folderRoot)
  }

  const handleToggle = (event: SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  const handleNodeSelect = (_: any, nodeIds: string[]) => {
    setSelected(nodeIds)
    if (nodeIds.length !== 1) return
    const indexFolder = searchIndex.get(Number(nodeIds[0]))
    if (!indexFolder) return
    onFolderClick(indexFolder)
  }

  if (loading || !folderRoot?.id) return <Loading />
  return (
    <>
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
        onNodeSelect={handleNodeSelect}
        onNodeToggle={handleToggle}
      >
        <FolderTreeRecursive key={folderRoot.id} folder={folderRoot} />
      </TreeView>
    </>
  )
}
