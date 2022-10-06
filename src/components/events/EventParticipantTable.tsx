import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { EventSelectState } from './EventSelectState'
import { ParticipantState } from '../../model/enum/ParticipantState'
import { Participant } from '../../model/Participant'
import { subject } from '@casl/ability'
import { Can } from '../../Context/AuthorizationContext'

const columns: GridColDef[] = [
  {
    field: 'fullname',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex: 1,
  },
  {
    field: 'state',
    headerName: 'Status',
    type: 'singleSelect',
    valueOptions: Object.values(ParticipantState),
    flex: 1,
    renderCell: (params) => (
      <Can
        I="update"
        this={subject('eventparticipants', params.row)}
        passThrough
      >
        {(allowed) => (
          <EventSelectState
            participant={params.row as Participant}
            disabled={!allowed}
          />
        )}
      </Can>
    ),
  },
]

interface EventParticipantTableProps {
  participants: Participant[]
}

export function EventParticipantTable({
  participants,
}: EventParticipantTableProps) {
  return (
    <DataGrid
      rows={participants}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
      experimentalFeatures={{ newEditingApi: true }}
    />
  )
}
