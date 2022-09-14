import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { DynamicBaseInputProps } from '../DynamicInput'

export function DynamicPassword(props: DynamicBaseInputProps): JSX.Element {
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
  const [showPasswort, setShowPassword] = useState<boolean>(false)
  return (
    <TextField
      fullWidth={fullWidth ?? false}
      style={{ width: width100 ? '100%' : undefined }}
      type={showPasswort ? 'text' : 'password'}
      key={`input-text-${name}`}
      name={name}
      label={label}
      value={value ?? ''}
      disabled={disabled}
      error={error}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      helperText={error ? errorMessage : helperText}
      onMouseLeave={() => setShowPassword(false)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPasswort)}
              edge="end"
            >
              {showPasswort ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
