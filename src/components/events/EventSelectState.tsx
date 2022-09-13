import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Chip, SelectChangeEvent } from '@mui/material'
import { ParticipantState } from '../../enum/ParticipantState'

interface EventSelectStateProps {
  value: ParticipantState
  onChange: (event: SelectChangeEvent<ParticipantState>) => void
}

export function EventSelectState ({ value, onChange }: EventSelectStateProps) {
  return (
    <Select
      value={value}
      fullWidth
      onChange={onChange}
      size="small"
      sx={{ height: 1 }}
    >
      <MenuItem value={'commitment'}>
        <Chip color="success" size="small" label={'Zusage'}/>
      </MenuItem>
      <MenuItem value={'rejected'}>
        <Chip color="error" size="small" label={'Abgelehnt'}/>
      </MenuItem>
      <MenuItem value={'withreservation'}>
        <Chip color="warning" size="small" label={'Mit Vorbehalt'}/>
      </MenuItem>
      <MenuItem value={'outstanding'}>
        <Chip color="info" size="small" label={'Ausstehend'}/>
      </MenuItem>
    </Select>
  )
}
