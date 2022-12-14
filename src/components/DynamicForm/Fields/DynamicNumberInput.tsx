import { TextField } from '@mui/material'
import { DynamicBaseInputProps } from '../DynamicInput'

export function DynamicNumberInput(props: DynamicBaseInputProps): JSX.Element {
  const {
    name,
    value,
    label,
    error,
    placeholder,
    errorMessage,
    helperText,
    onBlur,
    onChange,
    fullWidth,
    width100,
    disabled,
  } = props
  return (
    <TextField
      fullWidth={fullWidth ?? false}
      style={{ width: width100 ? '100%' : undefined }}
      type="number"
      key={`input-number-${name}`}
      disabled={disabled}
      name={name}
      label={label}
      value={value ?? 0}
      error={error}
      placeholder={placeholder}
      onChange={(event) => {
        onChange(Number(event.target.value))
      }}
      onBlur={onBlur}
      helperText={error ? errorMessage : helperText}
    />
  )
}
