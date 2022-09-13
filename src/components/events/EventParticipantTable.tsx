import { DataGrid, GridColDef, GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid'
import { Chip, SelectChangeEvent } from '@mui/material'
import { EventSelectState } from './EventSelectState'
import { ParticipantState, translationTableColors, translationTableEnum } from '../../enum/ParticipantState'
import { Participant } from '../../model/Participant'

function SelectEditInputCell (props: GridRenderCellParams) {
  const { id, value, field } = props
  const apiRef = useGridApiContext()

  const handleChange = async (event: SelectChangeEvent) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value })

    apiRef.current.stopCellEditMode({ id, field })
  }

  return <EventSelectState value={value} onChange={handleChange}/>
}

const renderSelectEditInputCell: GridColDef['renderCell'] = (params) => {
  return <SelectEditInputCell {...params} />
}
const columns: GridColDef[] = [
  {
    field: 'fullname',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex: 1
  },
  {
    field: 'state',
    headerName: 'Status',
    type: 'singleSelect',
    valueOptions: Object.values(ParticipantState),
    editable: true,
    flex: 1,
    renderCell: params => (
      <Chip label={translationTableEnum[params.value]}
            size="small"
            color={translationTableColors[params.value]}/>

    ),
    renderEditCell: renderSelectEditInputCell
  }
]

interface EventParticipantTableProps {
  participants: Participant[]
}

export function EventParticipantTable ({ participants }: EventParticipantTableProps) {
  return <DataGrid
    rows={participants}
    columns={columns}
    pageSize={5}
    rowsPerPageOptions={[5]}
    disableSelectionOnClick
    experimentalFeatures={{ newEditingApi: true }}
  />
}
