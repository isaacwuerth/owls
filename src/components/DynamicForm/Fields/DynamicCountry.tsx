import { Box, CircularProgress, TextField } from '@mui/material'
import { DynamicBaseInputProps } from '../DynamicInput'
import Autocomplete from '@mui/material/Autocomplete'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import axiosRetry from 'axios-retry'
import axios from 'axios'

interface CountryType {
  code: string
  label: string
  region: string
}

interface CountryResponse {
  name: { common: string }
  cca2: string
  translations: any
  region: string
}

const typewatch = (callback: (...p: any) => void, ms: number) => {
  let timer: any = 0
  return function (...params: any) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // eslint-disable-next-line n/no-callback-literal
      callback(...params)
    }, ms)
  }
}

export function DynamicCountry(props: DynamicBaseInputProps): JSX.Element {
  const {
    label,
    error,
    placeholder,
    errorMessage,
    helperText,
    onBlur,
    onChange,
    value,
    fullWidth,
    disabled,
  } = props
  const [countries, setCountries] = useState<CountryType[]>([])
  const [selected, setSelected] = useState<CountryType | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [open, setOpen] = useState(false)
  const loading = open && countries.length === 0 && inputValue.length > 0

  async function handleInputChange(event: ChangeEvent<{}>, value: string) {
    setInputValue(value)
    if (value === '' || !value) return
    axiosRetry(axios, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    })
    axios('https://restcountries.com/v3.1/translation/' + value)
      .then((response) => {
        const countries: CountryType[] = response.data.map(
          (country: CountryResponse) => {
            return {
              code: country.cca2,
              label: country.translations.deu?.common ?? country.name,
              region: country.region,
            }
          }
        )
        setCountries(countries.sort((a, b) => a.region.localeCompare(b.region)))
      })
      .catch(() => {})
  }

  function handleSelected(event: any, newValue: CountryType | null) {
    setSelected(newValue)
    onChange(newValue?.code)
  }

  useEffect(() => {
    if (!value) return
    const cca2 = String(value)
    axiosRetry(axios, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    })
    axios('https://restcountries.com/v3.1/alpha?codes=' + cca2)
      .then((response) => {
        const countries: CountryType[] = response.data.map(
          (country: CountryResponse) => {
            return {
              code: country.cca2,
              label: country.translations.deu?.common ?? country.name,
              region: country.region,
            }
          }
        )
        setCountries(countries)
        if (countries.length) setSelected(countries[0])
      })
      .catch(() => {})
  }, [value])

  return (
    <Autocomplete
      id="country-select-demo"
      options={countries}
      autoHighlight
      fullWidth={fullWidth ?? false}
      value={selected}
      groupBy={(option) => option.region}
      isOptionEqualToValue={(option, value1) => option.code === value1.code}
      getOptionLabel={(option) => option.label}
      onInputChange={typewatch(handleInputChange, 600)}
      onChange={handleSelected}
      onBlur={onBlur}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      disabled={disabled}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
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
          variant="filled"
          fullWidth={fullWidth ?? false}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
            startAdornment: (
              <Fragment>
                {selected ? (
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${selected.code.toLowerCase()}.png 2x`}
                    alt=""
                  />
                ) : null}
              </Fragment>
            ),
          }}
          helperText={error ? errorMessage : helperText}
          placeholder={placeholder}
        />
      )}
    />
  )
}
