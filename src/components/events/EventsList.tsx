import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { useRecoilValue } from 'recoil'
import { eventListState } from '../../atoms/EventAtom.'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', resizable: true },
  {
    resizable: true,
    field: 'title',
    headerName: 'Titel'
  },
  {
    field: 'start',
    headerName: 'Start',
    type: 'dateTime',
    resizable: true
  },
  {
    field: 'end',
    headerName: 'ende',
    type: 'dateTime',
    resizable: true
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Aktionen'
  }
]

export default function EventsList () {
  const navigate = useNavigate()
  columns[4].renderCell = (params) => {
    return [
      <GridActionsCellItem
        key={params.row.id}
        icon={<EditIcon/>}
        label="Edit"
        className="textPrimary"
        color="inherit"
      />,
      <GridActionsCellItem
        key={params.row.id}
        icon={<VisibilityIcon/>}
        label="View"
        className="textPrimary"
        color="inherit"
        onClick={() => navigate(params.row.id)}
      />
    ]
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
