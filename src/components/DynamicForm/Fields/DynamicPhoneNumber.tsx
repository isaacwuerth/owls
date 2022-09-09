import React from 'react'
import { DynamicBaseInputProps } from '../DynamicInput'
import { Icon, InputAdornment, TextField } from '@mui/material'
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js'
import Countries from './countries.json'

export function DynamicPhoneNumber (props: DynamicBaseInputProps): JSX.Element {
  const { name, value, label, error, errorMessage, helperText, onChange, fullWidth, width100, placeholder, onBlur } = props
  const [phoneNumber, setPhoneNumber] = React.useState<string>(value as string ?? '')
  const [flag, setFlag] = React.useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const phone = new AsYouType().input(value)

    setPhoneNumber(phone)
    onChange(phone)
    try {
      const phoneNumber = parsePhoneNumber(value)
      // @ts-expect-error
      setFlag(Countries[phoneNumber?.country ?? ''])
    } catch (e) {
      setFlag(null)
    }
  }

  return (
    <TextField
      fullWidth={fullWidth ?? false}
      style={{ width: width100 ? '100%' : undefined }}
      type="text"
      key={`input-text-${name}`}
      name={name}
      label={label}
      value={phoneNumber}
      error={error}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={onBlur}
      helperText={error ? errorMessage : helperText}
      InputProps={{
        endAdornment: (
          <>
            {flag && <InputAdornment position="end"><Icon><img src={flag}/></Icon></InputAdornment>}
      </>
        )
      }}
    />
  )
}
