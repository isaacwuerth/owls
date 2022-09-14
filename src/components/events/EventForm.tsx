import Grid2 from '@mui/material/Unstable_Grid2' // Grid version 2
import React from 'react'
import { Box, Typography } from '@mui/material'
import { InputWrapper } from '../DynamicForm/InputWrapper'
import { InputType } from '../DynamicForm/InputType'

export function EventForm () {
  return (
      <Box component={'form'}>
        <Grid2 xs={12}>
          <Typography variant='h6'>Veranstalltung</Typography>
        </Grid2>
        <Grid2 container spacing={3}>
          <Grid2 xs={12}>
            <InputWrapper
              type={InputType.STRING}
              label='Titel'
              mandatory
              name={'title'}
              placeholder={'Veranstalltungs Titel'}
           />
          </Grid2>
          <Grid2 xs={12}>
            <InputWrapper
              type={InputType.DATETIME}
              label='Start'
              mandatory
              name='start'
              placeholder={'Datum auswählen'}
            />
          </Grid2>
          <Grid2 xs={12}>
            <InputWrapper
              type={InputType.DATETIME}
              label={'Ende'}
              mandatory
              name='end'
              placeholder={'Datum auswählen'}
            />
          </Grid2>
          <Grid2 xs={12}>
            <Typography variant='h6'>Angaben zum Ort</Typography>
          </Grid2>
          <Grid2 xs={12} md={4}>
            <InputWrapper
              type={InputType.STRING}
              label={'PLZ'}
              mandatory
              name='postcode'
              placeholder={'Bitte die Postleitzahl des Ortes angeben'}
            />
          </Grid2>
          <Grid2 xs={12} md={8}>
            <InputWrapper
              type={InputType.STRING}
              label={'Ort'}
              mandatory
              name='city'
              placeholder={'Bitte Ort eigeben'}
            />
          </Grid2>
          <Grid2 xs={12}>
            <InputWrapper
              type={InputType.STRING}
              label={'Strasse und Hausnummer'}
              mandatory
              name='street'
              placeholder={'Bitte den Ort eingeben'}
            />
          </Grid2>
        </Grid2>
      </Box>
  )
}
