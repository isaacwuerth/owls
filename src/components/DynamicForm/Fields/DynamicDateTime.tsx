import { TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import React from 'react'
import { DynamicBaseInputProps } from '../DynamicInput'

export function DynamicDateTime (props: DynamicBaseInputProps): JSX.Element {
  const { name, value, label, error, placeholder, errorMessage, helperText, onBlur, onChange, fullWidth, width100 } = props
  return (
        <DateTimePicker
            key={`input-datetime-${name}`}
            label={label}
            value={value ?? null}
            onChange={onChange}
            renderInput={(params) => <TextField
              {...params}
              fullWidth={fullWidth ?? false}
              style={{ width: width100 ? '100%' : undefined }}
              name={name}
              error={error}
              placeholder={placeholder}
              onBlur={onBlur}
              helperText={error ? errorMessage : helperText}
              InputLabelProps={{
                shrink: true
              }}
            />}
        />
  )
}
