import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import TreeView from '@mui/lab/TreeView'
import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Grid from '@mui/material/Unstable_Grid2'
import FolderIcon from '@mui/icons-material/Folder'
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { styled } from '@mui/material/styles'

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
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
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

/**
 * * root
 * | Folder 1
 * | Folder 2
 *   - File 1
 *   - File 2
 */
export function FileManagerPage() {
  const [expanded, setExpanded] = useState<string[]>([])

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ['1', '5', '6', '7'] : []
    )
  }

  return (
    <Box style={{ marginTop: 20, marginRight: 20 }}>
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
                expanded={expanded}
                onNodeToggle={handleToggle}
              >
                <StyledTreeItem
                  nodeId="1"
                  labelText="Avatar"
                  labelIcon={FolderIcon}
                >
                  <StyledTreeItem
                    nodeId="2"
                    labelText="Avatar"
                    labelIcon={FolderIcon}
                  />
                </StyledTreeItem>
              </TreeView>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card>
            <CardHeader title={'Files'} />
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
