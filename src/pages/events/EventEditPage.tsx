import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { GeneralEvent, GeneralEventSchema } from '../../model/GeneralEvent'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebase } from '../../Context/FirebaseContext'
import { Loading } from '../../common/Loading'
import { EventForm } from '../../components/events/EventForm'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { generalErrorHandler } from '../../utils/generalErrorHandler'

export function EventEditPage() {
  const { eid } = useParams()
  const { eventRepository } = useFirebase()
  const [event, setEvent] = useState<GeneralEvent | null>(null)
  const navigate = useNavigate()

  const methods = useForm<GeneralEvent>({
    resolver: zodResolver(GeneralEventSchema),
    defaultValues: event ?? {},
  })

  useEffect(() => {
    if (eid != null) {
      eventRepository
        .findOne(eid)
        .then((e) => {
          setEvent(e)
          methods.reset(e)
        })
        .catch(generalErrorHandler)
    }
  }, [])

  if (!eid || !event) return <Loading />

  const onSubmit = (eventEdited: GeneralEvent) => {
    eventRepository
      .update(eid, eventEdited)
      .then(() => navigate('..'))
      .catch(generalErrorHandler)
  }

  return (
    <Card>
      <CardContent>
        <FormProvider {...methods}>
          <Typography variant="h2">Event anpassen</Typography>
          <EventForm />
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="reset"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => methods.reset(event)}
              style={{ width: '100%', margin: '5px' }}
            >
              Abort
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={methods.handleSubmit(onSubmit)}
              style={{ width: '100%', margin: '5px' }}
            >
              Run
            </Button>
          </Box>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
