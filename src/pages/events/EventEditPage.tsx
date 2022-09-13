import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GeneralEvent, GeneralEventSchema } from '../../model/GeneralEvent'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebase } from '../../Context/FirebaseContext'
import { Loading } from '../../components/common/Loading'
import { EventForm } from '../../components/events/EventForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

export function EventEditPage () {
  const { eid } = useParams()
  const { eventRepository } = useFirebase()
  const [event, setEvent] = useState<GeneralEvent | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (eid != null) {
      eventRepository.findOne(eid).then(setEvent).catch(console.error)
    }
  }, [])

  const form = useForm<GeneralEvent>({
    resolver: zodResolver(GeneralEventSchema),
    defaultValues: event ?? {}
  })
  const {
    handleSubmit,
    reset
  } = form

  if (!eid || !event) return (<Loading/>)

  const onSubmit = (eventEdited: GeneralEvent) => {
    eventRepository.update(eid, eventEdited)
      .then(() => navigate('..'))
      .catch(console.error)
  }

  return (
      <Card>
        <CardContent>
          <Typography variant="h2">Event anpassen</Typography>
          <EventForm form={form} mode='edit' onSubmit={onSubmit} event={event}/>
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
  )
}
