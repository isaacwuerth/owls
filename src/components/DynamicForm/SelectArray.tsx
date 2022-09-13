import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material'
import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { DynamicInputFieldProps } from './InputArray'

export function SelectArray ({ field, form }: DynamicInputFieldProps): JSX.Element {
  const { name, label, helpMessage, defaultValue } = field
  const { append, remove } = useFieldArray({
    control: form.control,
    name
  })

  const error = form.formState.errors[name]

  function handleChange (event: any) {
    const name = event.target.name
    const checked = event.target.checked
    if (checked) append(name)
    if (!checked) {
      const list = form.getValues(`${field.name}`)
      const index = list.findIndex((value: any) => value === name)
      remove(index)
    }
  }

  function isChecked (option: string): boolean {
    const list: string[] = form.getValues(`${name}`)
    return list.includes(option)
  }

  return (
        <Controller
            control={form.control}
            name={field.name}
            defaultValue={defaultValue}
            render={({ field: { name, value, onBlur, onChange } }) => (
                <FormControl component="fieldset" variant="standard" fullWidth error={Boolean(error?.message)}>
                    <FormLabel component="legend">{label}</FormLabel>
                    <FormGroup>
                        {field.selectableValues?.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        key={`input-checkbox-${name}-${index}`}
                                        name={option}
                                        onChange={handleChange}
                                        onBlur={() => onBlur()}
                                        checked={isChecked(option)}
                                    />
                                }
                                label={option}
                            />
                        ))}

                    </FormGroup>
                    {(error?.message ?? helpMessage) &&
                        <FormHelperText>{error?.message?.toString() ?? helpMessage}</FormHelperText>}
                </FormControl>
            )}
        />
  )
}
