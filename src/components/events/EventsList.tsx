import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRecoilValue } from 'recoil'
import { eventListState } from '../../atoms/EventsAtom.'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', resizable: true },
  {
    resizable: true,
    field: 'title',
    flex: 1,
    headerName: 'Titel'
  },
  {
    field: 'start',
    headerName: 'Start',
    flex: 1,
    type: 'dateTime',
    resizable: true
  },
  {
    field: 'end',
    headerName: 'Ende',
    flex: 1,
    type: 'dateTime',
    resizable: true
  },
  {
    field: 'actions',
    width: 100,
    type: 'actions',
    headerName: 'Aktionen'
  }
]

export default function EventsList () {
  const navigate = useNavigate()
  columns[4].renderCell = (params) => {
    return <>
      <IconButton
        aria-label="View"
        onClick={() => navigate(String(params.row.id))}
      ><VisibilityIcon/></IconButton>
      <IconButton
        aria-label="Edit"
        onClick={() => navigate(String(params.row.id) + '/edit')}
      ><EditIcon/></IconButton>

    </>
  }

  const events = useRecoilValue(eventListState)
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={events}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  )
}
