import { Box, TextField } from '@mui/material'
import { DynamicBaseInputProps } from '../DynamicInput'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { ChangeEvent, useState } from 'react'

interface CountryType {
  code: string
  label: string
  phone: string
  suggested?: boolean
}

interface CountryResponse {
  name: {common: string}
  cca2: string
}

export function DynamicInputText (props: DynamicBaseInputProps): JSX.Element {
  const { label, error, placeholder, errorMessage, helperText, onBlur, onChange } = props
  const [countries, setCountries] = useState<CountryType[]>([])

  function handleInputChange (event: ChangeEvent<{}>, value: string) {
    axios.get('https://restcountries.com/v3.1/name/' + value).then((response) => {
      const countries = response.data.map((country: CountryResponse) => {
        return {
          code: country.cca2,
          label: country.name.common
        }
      })
      setCountries(countries)
    }).catch(console.error)
  }

  return (
      <Autocomplete
        id="country-select-demo"
        sx={{ width: 300 }}
        options={countries}
        autoHighlight
        getOptionLabel={(option) => option.label}
        onInputChange={handleInputChange}
        onChange={onChange}
        onBlur={onBlur}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              alt=""
            />
            {option.label} ({option.code})
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password' // disable autocomplete and autofill
            }}
            helperText={error ? errorMessage : helperText}
            placeholder={placeholder}
          />
        )}
      />
  )
}
