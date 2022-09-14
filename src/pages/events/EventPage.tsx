import { Box, Button, Card, Tab, Tabs, Typography } from '@mui/material'
import { PropsWithChildren, SyntheticEvent, useEffect, useState } from 'react'
import { ParticipantState } from '../../enum/ParticipantState'
import { GeneralEvent } from '../../model/GeneralEvent'
import Grid2 from '@mui/material/Unstable_Grid2'
import { useParams } from 'react-router-dom'
import { useFirebase } from '../../Context/FirebaseContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { ChartParticipantState } from '../../components/events/EventParticipantStateChart'
import { EventParticipantTable } from '../../components/events/EventParticipantTable'
import { EventSelectState } from '../../components/events/EventSelectState'
import { InfoTable, InfoTableRow } from '../../components/common/InfoTable'
import { Loading } from '../../components/common/Loading'
import { Participant } from '../../model/Participant'
import { generalErrorHandler } from '../../utils/generalErrorHandler'
import { useRecoilValue } from 'recoil'
import { profileAtom } from '../../atoms/ProfileAtom'

interface TabPanelProps {
  index: number
  value: number
}

function TabPanel (props: PropsWithChildren<TabPanelProps>) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps (index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export function EventPage () {
  const { eid } = useParams<{ eid: string }>()
  const profile = useRecoilValue(profileAtom)
  const [event, setEvent] = useState<GeneralEvent | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [value, setValue] = useState(0)
  const [ownState, setOwnState] = useState<ParticipantState | null>(null)

  const { apps: { firestore }, eventRepository, participantRepository } = useFirebase()

  if (!eid) return (<Loading/>)

  useEffect(() => {
    const eventUbsub = onSnapshot(doc(firestore, `events/${eid}`), (doc) => {
      setEvent(doc.data() as GeneralEvent)
    })

    const participantsUnsub = participantRepository.onEventParticipantsChange(eid, (participants) => {
      setParticipants(participants)
      setOwnState(participants.find(p => p.uid === profile.id)?.state ?? ParticipantState.OUTSTANDING)
    })

    async function loadEvent () {
      if (!eid) return
      setEvent(await eventRepository.findOne(eid))
    }

    async function loadParticipants () {
      if (!eid) return
      setParticipants(await participantRepository.findByEvent(eid))
    }

    loadEvent().catch(generalErrorHandler)
    loadParticipants().catch(generalErrorHandler)

    return function CleanUp () {
      eventUbsub()
      participantsUnsub()
    }
  }, [])

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  if (!event) return (<Loading/>)
  const table: InfoTableRow[] = [
    { label: 'Name', value: event.title },
    { label: 'Start', value: String(event.start.toLocaleString()) },
    { label: 'Ende', value: String(event.end.toLocaleString()) },
    { label: 'Meine Teilnahme', value: <EventSelectState eid={eid} uid={profile.id ?? ''} value={ownState ?? ParticipantState.OUTSTANDING} /> }
  ]
  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid2 container style={{ width: '100%' }}>
          <Grid2 xs={12} alignItems='end' md={8}>
            <Typography variant='h2' component={'span'}>{event.title}</Typography>
          </Grid2>
          <Grid2 xs={12} alignItems='end' md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <Button variant='contained'>Bearbeiten</Button>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Teilnehmer" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} md={6}>
            <Card>
              <InfoTable table={table}/>
            </Card>
          </Grid2>
          <Grid2 xs={12} md={6}>
            <ChartParticipantState participants={participants}/>
          </Grid2>
        </Grid2>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Card>
          <Box sx={{ height: 400, width: '100%' }}>
            <EventParticipantTable participants={participants}/>
          </Box>
        </Card>
      </TabPanel>
    </>
  )
}
