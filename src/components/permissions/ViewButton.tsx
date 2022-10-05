import { useRecoilState } from 'recoil'
import {
  permissionTableViews,
  permissionTableViewState,
} from '../../atoms/PermissionTableViewState'
import { IconButton, Tooltip } from '@mui/material'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'

export function ViewButton() {
  const [view, setView] = useRecoilState(permissionTableViewState)

  function handleClick() {
    const newIndex =
      (permissionTableViews.findIndex((value) => value === view) + 1) %
      permissionTableViews.length
    setView(permissionTableViews[newIndex])
  }

  return (
    <Tooltip title="Ansicht verändern">
      <IconButton onClick={handleClick}>
        {view === 'vertical' ? <TableRowsIcon /> : <ViewColumnIcon />}
      </IconButton>
    </Tooltip>
  )
}
