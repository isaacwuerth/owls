import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Switch,
} from '@mui/material'
import { DynamicBaseInputProps } from '../DynamicInput'

export function DynamicSwitchInput(props: DynamicBaseInputProps): JSX.Element {
  const {
    name,
    value,
    label,
    error,
    errorMessage,
    helperText,
    onBlur,
    onChange,
    disabled,
  } = props
  return (
    <FormControl error={error} fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <FormControlLabel
        disabled={disabled}
        style={{ width: '100%' }}
        label={label}
        control={
          <Switch
            name={name}
            key={`input-switch-${name}`}
            onChange={(event) => onChange(Boolean(event.target.checked))}
            onBlur={onBlur}
            value={value}
          />
        }
      />
      {(helperText || error) && (
        <FormHelperText>{error ? errorMessage : helperText}</FormHelperText>
      )}
    </FormControl>
  )
}
