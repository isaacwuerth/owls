import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import { GeneralEvent } from '../../model/GeneralEvent'
import { Can } from '../../Context/AuthorizationContext'
import { subject } from '@casl/ability'
import _ from 'lodash'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', hide: true },
  {
    field: 'title',
    flex: 1,
    headerName: 'Titel',
  },
  {
    field: 'start',
    headerName: 'Start',
    flex: 1,
    type: 'dateTime',
  },
  {
    field: 'end',
    headerName: 'Ende',
    flex: 1,
    type: 'dateTime',
  },
  {
    field: 'postcode',
    headerName: 'Ort',
    flex: 1,
    type: 'dateTime',
    valueGetter: (params: GridValueGetterParams<string, GeneralEvent>) => {
      return `${params.row.postcode as string} ${params.row.city as string}, ${
        params.row.street as string
      }`
    },
  },
  {
    field: 'actions',
    width: 125,
    type: 'actions',
    headerName: 'Aktionen',
  },
]

interface EventListProps {
  events: GeneralEvent[]
  onDelete: (id: string) => void
}

export default function EventsTable({ events, onDelete }: EventListProps) {
  const navigate = useNavigate()
  columns[5].renderCell = (params) => {
    return (
      <>
        <Can I="get" this={subject('events', _.cloneDeep(params.row))}>
          <IconButton
            aria-label="View"
            onClick={() => navigate(String(params.row.id))}
          >
            <VisibilityIcon />
          </IconButton>
        </Can>
        <Can I="update" this={subject('events', _.cloneDeep(params.row))}>
          <IconButton
            aria-label="Edit"
            onClick={() => navigate(String(params.row.id) + '/edit')}
          >
            <EditIcon />
          </IconButton>
        </Can>
        <Can I="delete" this={subject('events', _.cloneDeep(params.row))}>
          <IconButton aria-label="Edit" onClick={() => onDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Can>
      </>
    )
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
