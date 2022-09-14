import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Chip, SelectChangeEvent } from '@mui/material'
import { ParticipantState } from '../../model/enum/ParticipantState'
import { useState } from 'react'
import { generalErrorHandler } from '../../utils/generalErrorHandler'
import { useFirebase } from '../../Context/FirebaseContext'

interface EventSelectStateProps {
  value: ParticipantState
  uid: string
  eid: string
}

export function EventSelectState({ value, eid, uid }: EventSelectStateProps) {
  const [state, setState] = useState<ParticipantState>(value)
  const { participantRepository } = useFirebase()
  async function handleSelect(event: SelectChangeEvent) {
    const state = event.target.value as ParticipantState
    await participantRepository
      .updateUserState(eid, uid, state)
      .catch(generalErrorHandler)
    setState(state)
  }

  return (
    <Select
      value={state}
      fullWidth
      onChange={handleSelect}
      size="small"
      sx={{ height: 1 }}
    >
      <MenuItem value={'commitment'}>
        <Chip color="success" size="small" label={'Zusage'} />
      </MenuItem>
      <MenuItem value={'rejected'}>
        <Chip color="error" size="small" label={'Abgelehnt'} />
      </MenuItem>
      <MenuItem value={'withreservation'}>
        <Chip color="warning" size="small" label={'Mit Vorbehalt'} />
      </MenuItem>
      <MenuItem value={'outstanding'}>
        <Chip color="info" size="small" label={'Ausstehend'} />
      </MenuItem>
    </Select>
  )
}
