import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import { GeneralEvent } from '../../model/GeneralEvent'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', hide: true },
  {
    field: 'title',
    flex: 1,
    headerName: 'Titel'
  },
  {
    field: 'start',
    headerName: 'Start',
    flex: 1,
    type: 'dateTime'
  },
  {
    field: 'end',
    headerName: 'Ende',
    flex: 1,
    type: 'dateTime'
  },
  {
    field: 'postcode',
    headerName: 'Ort',
    flex: 1,
    type: 'dateTime',
    valueGetter: params => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${params.row.postcode} ${params.row.city}, ${params.row.street}`
    }
  },
  {
    field: 'actions',
    width: 125,
    type: 'actions',
    headerName: 'Aktionen'
  }
]

interface EventListProps {
  events: GeneralEvent[]
  onDelete: (id: string) => void
}

export default function EventsList ({ events, onDelete }: EventListProps) {
  const navigate = useNavigate()
  columns[5].renderCell = (params) => {
    return <>
      <IconButton
        aria-label="View"
        onClick={() => navigate(String(params.row.id))}
      >
        <VisibilityIcon/>
      </IconButton>
      <IconButton
        aria-label="Edit"
        onClick={() => navigate(String(params.row.id) + '/edit')}
      >
        <EditIcon/>
      </IconButton>
      <IconButton
        aria-label="Edit"
        onClick={() => onDelete(params.row.id)}
      >
        <DeleteIcon/>
      </IconButton>
    </>
  }

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
