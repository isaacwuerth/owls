import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { FolderOwls } from '../../model/FileFolder'
import FolderIcon from '@mui/icons-material/Folder'

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string
    '--tree-view-bg-color'?: string
  }
}

const FolderTreeItemRoot = styled(TreeItem)(({ theme }) => ({
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

type FolderTreeItemProps = TreeItemProps & {
  bgColor?: string
  color?: string
  labelIcon: React.ElementType<SvgIconProps>
  labelInfo?: string
  labelText: string
}

function FolderTreeItem(props: FolderTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props

  return (
    <FolderTreeItemRoot
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

interface FolderTreeRootProps {
  folder: FolderOwls
}

export function FolderTreeRecursive({ folder }: FolderTreeRootProps) {
  return (
    <FolderTreeItem
      key={folder.id}
      nodeId={String(folder.id)}
      labelText={folder.name}
      labelIcon={FolderIcon}
      color="#1a73e8"
      bgColor="#e8f0fe"
    >
      {folder.folders.map((f) => (
        <FolderTreeRecursive key={f.id} folder={f} />
      ))}
    </FolderTreeItem>
  )
}
