import EventsList from '../../components/events/EventsList'
import { useEffect, useState } from 'react'
import { GeneralEvent, GeneralEventSchema } from '../../model/GeneralEvent'
import { useFirebase } from '../../Context/FirebaseContext'
import { Box, Button, Typography } from '@mui/material'
import { Popup } from '../../components/Popup'
import { EventForm } from '../../components/events/EventForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import HorizontalLinearStepper, { HorizontalLinearStep } from '../../components/ProgressStepper'
import EnhancedTable from '../../components/EnhancedTable'
import { Participant } from '../../model/Participant'
import { ParticipantState } from '../../enum/ParticipantState'
import { ProfileSchema } from '../../model/Profil'
import './EventsPage.scss'
import { z } from 'zod'
import { generalErrorHandler } from '../../utils/generalErrorHandler'

const ProfileWithIdSchema = ProfileSchema
  .omit({ id: true })
  .extend({ id: z.string() })

type ProfileWithId = z.infer<typeof ProfileWithIdSchema>

export function EventsPage () {
  const [events, setEvents] = useState<GeneralEvent[]>([])
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [users, setUsers] = useState<ProfileWithId[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const { eventRepository, usersRepository, participantRepository } = useFirebase()

  const form = useForm<GeneralEvent>({ resolver: zodResolver(GeneralEventSchema) })
  const {
    handleSubmit,
    reset
  } = form

  async function crateParticipants (eid: string) {
    const participants: Participant[] = selectedUsers.map(uid => {
      return {
        eid,
        uid,
        state: ParticipantState.OUTSTANDING,
        fullname: uid
      }
    })
    await participantRepository.createFromArray(participants)
  }

  function onSubmit (eventEdited: GeneralEvent) {
    eventRepository.create(eventEdited).then(async (eid) => {
      await crateParticipants(eid)
      setShowPopup(false)
      reset()
    }).catch(generalErrorHandler)
  }

  async function handleDelete (id: string) {
    await eventRepository.delete(id)
    const participants = await participantRepository.findByEvent(id)
    for (const participant of participants) {
      await participantRepository.delete(participant.id as string)
    }
  }

  useEffect(() => {
    eventRepository.onCollectionUpdate(setEvents)
    // @ts-expect-error
    usersRepository.onCollectionUpdate(setUsers)
  }, [])
  return (
    <>
      <Button variant='outlined' onClick={() => setShowPopup(true)}>Erstellen</Button>
      <EventsList events={events} onDelete={handleDelete}/>
      <Popup title='Event erstellen' open={showPopup} handleClose={() => setShowPopup(false)} handleSave={handleSubmit(onSubmit)}>
        <Box sx={{ minWidth: { md: '500px' } }}>
          <HorizontalLinearStepper>
            <HorizontalLinearStep title={'Veranstalltung'}
                                  error={!form.formState.isValid && form.formState.isSubmitted}>
              <EventForm form={form} mode='create' onSubmit={eventEdited => {}}/>
            </HorizontalLinearStep>
            <HorizontalLinearStep title={'Teilnehmer'}>
              <EnhancedTable selected={selectedUsers}
                             setSelected={setSelectedUsers}
                             rowsPerPage={5}
                             rows={users}
                             columns={[{
                               name: 'firstName',
                               label: 'Vorname',
                               numeric: false,
                               disablePadding: false
                             },
                             {
                               name: 'lastName',
                               label: 'Nachname',
                               numeric: false,
                               disablePadding: false
                             }
                             ]}
                             defaultOrderBy='firstName'
              />
            </HorizontalLinearStep>
            <HorizontalLinearStep title={'Übersicht'}>
              <Typography title='Test'>Finished</Typography>
            </HorizontalLinearStep>
          </HorizontalLinearStepper>
        </Box>
      </Popup>
    </>
  )
}
