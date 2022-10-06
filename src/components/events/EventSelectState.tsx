import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Chip, SelectChangeEvent } from '@mui/material'
import { ParticipantState } from '../../model/enum/ParticipantState'
import { useEffect, useState } from 'react'
import { generalErrorHandler } from '../../utils/generalErrorHandler'
import { useFirebase } from '../../Context/FirebaseContext'
import { Participant } from '../../model/Participant'

interface EventSelectStateProps {
  participant: Participant
  disabled?: boolean
}

export function EventSelectState({
  participant,
  disabled,
}: EventSelectStateProps) {
  const [state, setState] = useState<ParticipantState>(participant.state)
  const { participantRepository } = useFirebase()
  async function handleSelect(event: SelectChangeEvent) {
    const state = event.target.value as ParticipantState
    participant.state = state
    await participantRepository
      .update(participant.id as string, participant)
      .catch(generalErrorHandler)
    setState(state)
  }

  const states = {
    [ParticipantState.COMMITMENT]: (
      <Chip color="success" size="small" label={'Zusage'} />
    ),
    [ParticipantState.OUTSTANDING]: (
      <Chip color="info" size="small" label={'Ausstehend'} />
    ),
    [ParticipantState.REJECTED]: (
      <Chip color="error" size="small" label={'Abgelehnt'} />
    ),
    [ParticipantState.WITHRESERVATION]: (
      <Chip color="warning" size="small" label={'Mit Vorbehalt'} />
    ),
  }

  useEffect(() => {
    setState(participant.state)
  }, [participant.state])

  if (disabled) return states[state]
  return (
    <Select
      value={state}
      fullWidth
      onChange={handleSelect}
      size="small"
      sx={{ height: 1 }}
    >
      {Object.entries(states).map(([key, value]) => (
        <MenuItem key={key} value={key} disabled={disabled}>
          {value}
        </MenuItem>
      ))}
    </Select>
  )
}
