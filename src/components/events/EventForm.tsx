import { GeneralEvent } from '../../model/GeneralEvent'
import Grid2 from '@mui/material/Unstable_Grid2' // Grid version 2
import React from 'react'
import { InputType } from '../DynamicForm/DynamicInput'
import { Input } from '../DynamicForm/Input'
import { Box, Typography } from '@mui/material'

interface EventFormProps {
  onSubmit: (eventEdited: GeneralEvent) => void
  event?: GeneralEvent
  mode: 'create' | 'edit'
  form: any
}

export function EventForm ({ form, event }: EventFormProps) {
  return (
      <Box component={'form'}>
        <Grid2 xs={12}>
          <Typography variant='h6'>Veranstalltung</Typography>
        </Grid2>
        <Grid2 container spacing={3}>
          <Grid2 xs={12}>
            <Input form={form} field={{
              type: InputType.STRING,
              defaultValue: event?.title,
              label: 'Titel',
              mandatory: true,
              isArray: false,
              name: 'title',
              placeholder: 'Veranstalltungs Titel'
            }}/>
          </Grid2>
          <Grid2 xs={12}>
            <Input form={form} field={{
              type: InputType.DATETIME,
              label: 'Start',
              defaultValue: event?.start,
              mandatory: true,
              isArray: false,
              name: 'start',
              placeholder: 'Datum auswählen'
            }}/>
          </Grid2>
          <Grid2 xs={12}>
            <Input form={form} field={{
              type: InputType.DATETIME,
              label: 'Ende',
              defaultValue: event?.end,
              mandatory: true,
              isArray: false,
              name: 'end',
              placeholder: 'Datum auswählen'
            }}/>
          </Grid2>
          <Grid2 xs={12}>
            <Typography variant='h6'>Angaben zum Ort</Typography>
          </Grid2>
          <Grid2 xs={12} md={4}>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'PLZ',
              defaultValue: event?.postcode,
              mandatory: true,
              isArray: false,
              name: 'postcode',
              placeholder: 'Bitte die Postleitzahl des Ortes angeben'
            }}/>
          </Grid2>
          <Grid2 xs={12} md={8}>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'Ort',
              defaultValue: event?.city,
              mandatory: true,
              isArray: false,
              name: 'city',
              placeholder: 'Bitte Ort eigeben'
            }}/>
          </Grid2>
          <Grid2 xs={12}>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'Strasse und Hausnummer',
              defaultValue: event?.street,
              mandatory: true,
              isArray: false,
              name: 'street',
              placeholder: 'Bitte den Ort eingeben'
            }}/>
          </Grid2>
        </Grid2>
      </Box>
  )
}
