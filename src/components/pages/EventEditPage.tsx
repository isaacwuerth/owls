import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import React from 'react'
import { eventSelector } from '../../atoms/EventsAtom.'
import { GeneralEvent } from '../../model/GeneralEvent'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useParams } from 'react-router-dom'

export function EventEditPage () {
  const { id } = useParams()
  if (!id) return (<Typography>Loading...</Typography>)
  const [event, setEventState] = useRecoilState(eventSelector(id))
  if (!event) return (<Typography>Loading...</Typography>)
  const {
    control,
    handleSubmit,
    reset,
    formState
  } = useForm<GeneralEvent>({
    defaultValues: event
  })

  const onSubmit = (eventEdited: GeneralEvent) => {
    setEventState(eventEdited)
    console.log(eventEdited)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h2">Event anpassen</Typography>
          <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction='column' spacing={3}>
              <Grid item>
                <Controller
                  control={control}
                  name="title"
                  defaultValue={event.title}
                  rules={{
                    required: {
                      value: true,
                      message: 'This is mandatory'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Title"
                      type="text"
                      error={Boolean(formState.errors[field.name])}
                      helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Please put a email in'}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  control={control}
                  name="start"
                  defaultValue={(event.start != null) ? event.start : undefined}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Start"
                      renderInput={(params) => <TextField
                        error={Boolean(formState.errors[field.name])}
                        helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Bitte einen Nachnamen eingeben'}
                        {...params}
                      />}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  control={control}
                  name="end"
                  defaultValue={(event.end != null) ? event.end : undefined}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Ende"
                      renderInput={(params) => <TextField
                        error={Boolean(formState.errors[field.name])}
                        helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Bitte einen Nachnamen eingeben'}
                        {...params}
                      />}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="reset"
                    variant="outlined"
                    startIcon={<DeleteIcon/>}
                    onClick={() => reset()}
                    style={{ width: '100%', margin: '5px' }}>
              Abort
            </Button>
            <Button type="submit"
                    variant="contained"
                    endIcon={<SendIcon/>}
                    onClick={handleSubmit(onSubmit)}
                    style={{ width: '100%', margin: '5px' }}>
              Run
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
