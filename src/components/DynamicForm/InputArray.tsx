import { Box, Button, Grid, IconButton } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Controller, useFieldArray } from 'react-hook-form'
import { DynamicInput, InputType } from './DynamicInput'

export function getDefaultValue (type: InputType): any {
  if (type === InputType.INTEGER) return 0
  if (type === InputType.DECIMAL) return 0
  if (type === InputType.UNSIGNEDINTEGER) return 0
  if (type === InputType.STRING) return ''
  if (type === InputType.BOOLEAN) return false
  if (type === InputType.DATETIME) return new Date()
}

export interface FieldParameter {
  name: string
  label: string
  type: InputType
  isArray: boolean
  defaultValue?: number | string | boolean | Date | string[] | number[] | Date[]
  selectableValues?: string[]
  helpMessage?: string
  mandatory: boolean
  placeholder: string
}

export interface DynamicInputFieldProps {
  field: FieldParameter
  form: any
}

export function InputArray ({ field, form }: DynamicInputFieldProps): JSX.Element {
  const { name, defaultValue, type, placeholder } = field

  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name
  })

  return (
        <Grid container direction={'column'} spacing={1}>
            {
                fields.map((field, index) => {
                  return (
                        <Grid item key={index}>
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                <Controller
                                    name={`${name}.${index}`}
                                    control={form.control}
                                    defaultValue={defaultValue}
                                    render={({ field, fieldState }) => (
                                        <DynamicInput name={field.name}
                                                      label={field.name}
                                                      value={field.value}
                                                      error={Boolean(fieldState.error?.message)}
                                                      placeholder={placeholder}
                                                      helperText={fieldState.error?.message ?? ''}
                                                      errorMessage={fieldState.error?.message ?? ''}
                                                      onBlur={field.onBlur}
                                                      onChange={field.onChange}
                                                      type={type}
                                                      fullWidth
                                        />
                                    )}
                                />
                                <IconButton onClick={() => {
                                  insert(index, getDefaultValue(type))
                                }}>
                                    <AddIcon style={{ color: 'green' }}/>
                                </IconButton>
                                <IconButton onClick={() => {
                                  remove(index)
                                }}>
                                    <RemoveIcon style={{ color: 'red' }}/>
                                </IconButton>
                            </Box>
                        </Grid>
                  )
                })}
            <Grid item>
                <Button fullWidth variant="contained" color="primary"
                        onClick={() => {
                          append(getDefaultValue(type))
                        }}>Add</Button>
            </Grid>
        </Grid>
  )
}
