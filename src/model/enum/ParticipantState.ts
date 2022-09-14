import { OverridableStringUnion } from '@mui/types'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'

export enum ParticipantState {
  COMMITMENT = 'commitment',
  REJECTED = 'rejected',
  WITHRESERVATION = 'withreservation',
  OUTSTANDING = 'outstanding',
}

export const translationTableEnum: { [ParticipantState: string]: string } = {
  [ParticipantState.COMMITMENT]: 'Zusage',
  [ParticipantState.REJECTED]: 'Abgelehnt',
  [ParticipantState.WITHRESERVATION]: 'Mit Vorbehalt',
  [ParticipantState.OUTSTANDING]: 'Ausstehend',
}
export const translationTableColors: {
  [ParticipantState: string]: OverridableStringUnion<
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning',
    ChipPropsColorOverrides
  >
} = {
  [ParticipantState.COMMITMENT]: 'success',
  [ParticipantState.REJECTED]: 'error',
  [ParticipantState.WITHRESERVATION]: 'warning',
  [ParticipantState.OUTSTANDING]: 'info',
}
