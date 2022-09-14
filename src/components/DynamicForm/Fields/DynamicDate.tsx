import { TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { DynamicBaseInputProps } from '../DynamicInput'

export function DynamicDate(props: DynamicBaseInputProps): JSX.Element {
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
    <DatePicker
      key={`input-datetime-${name}`}
      label={label}
      disabled={disabled}
      value={value ?? null}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth={fullWidth ?? false}
          style={{ width: width100 ? '100%' : undefined }}
          name={name}
          error={error}
          placeholder={placeholder}
          onBlur={onBlur}
          helperText={error ? errorMessage : helperText}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  )
}
