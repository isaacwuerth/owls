import {
  Box,
  Button,
  Card,
  Chip,
  SelectChangeEvent,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  Typography
} from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid'
import { ParticipantState, translationTableColors, translationTableEnum } from '../../enum/ParticipantState'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { GeneralEvent, Participant } from '../../model/GeneralEvent'
import Grid2 from '@mui/material/Unstable_Grid2'
import { useParams } from 'react-router-dom'
import { useFirebase } from '../../Context/FirebaseContext'
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { ChartParticipantState } from './ChartParticipantState'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel (props: TabPanelProps) {
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
          <Typography>{children}</Typography>
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

const KeyTableCell = styled(TableCell)({
  fontWeight: 'bold'
})

function SelectEditInputCell (props: GridRenderCellParams) {
  const { id, value, field } = props
  const apiRef = useGridApiContext()

  const handleChange = async (event: SelectChangeEvent) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value })

    apiRef.current.stopCellEditMode({ id, field })
  }

  return (
    <Select
      value={value}
      fullWidth
      onChange={handleChange}
      size="small"
      sx={{ height: 1 }}
    >
      <MenuItem value={'commitment'}>
        <Chip color="success" size="small" label={'Zusage'}/>
      </MenuItem>
      <MenuItem value={'rejected'}>
        <Chip color="error" size="small" label={'Abgelehnt'}/>
      </MenuItem>
      <MenuItem value={'withreservation'}>
        <Chip color="warning" size="small" label={'Mit Vorbehalt'}/>
      </MenuItem>
      <MenuItem value={'outstanding'}>
        <Chip color="info" size="small" label={'Ausstehend'}/>
      </MenuItem>
    </Select>
  )
}

const renderSelectEditInputCell: GridColDef['renderCell'] = (params) => {
  return <SelectEditInputCell {...params} />
}

const columns: GridColDef[] = [
  {
    field: 'fullname',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex: 1
  },
  {
    field: 'state',
    headerName: 'Status',
    type: 'singleSelect',
    valueOptions: Object.values(ParticipantState),
    editable: true,
    flex: 1,
    renderCell: params => (
      <Chip label={translationTableEnum[params.value]}
            size="small"
            color={translationTableColors[params.value]}/>

    ),
    renderEditCell: renderSelectEditInputCell
  }
]

export function EventPage () {
  const { id } = useParams()
  if (!id) return (<Typography>Loading...</Typography>)
  const [event, setEvent] = useState<GeneralEvent | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [value, setValue] = useState(0)
  const [ownState, setOwnState] = useState<ParticipantState | null>(null)

  const { apps: { firestore, auth } } = useFirebase()

  async function changeStateOfParticipant (id: string, state: ParticipantState) {
    const docRef = doc(firestore, `eventparticipants/${id}`)
    await updateDoc(docRef, {
      state
    })
  }

  useEffect(() => {
    const eventUbsub = onSnapshot(doc(firestore, `events/${id}`), (doc) => {
      setEvent(doc.data() as GeneralEvent)
    })

    const participantsUnsub = onSnapshot(query(collection(firestore, 'eventparticipants'), where('eid', '==', id)),
      (querySnapshot) => {
        const participants: Participant[] = []
        querySnapshot.forEach((doc) => {
          participants.push(doc.data() as Participant)
        })
        setParticipants(participants)
        setOwnState(participants.find(p => p.uid === auth.currentUser?.uid)?.state ?? ParticipantState.OUTSTANDING)
      })

    async function loadEvent () {
      const event = await getDoc(doc(firestore, `events/${id as string}`))
      if (!event.exists()) {
        throw new Error('Event not found')
      }
      setEvent(event.data() as GeneralEvent)
    }

    async function loadParticipants () {
      const q = query(collection(firestore, 'eventparticipants'), where('eid', '==', id))
      const participants = await getDocs(q)
      if (participants.empty) {
        throw new Error('Participants not found')
      } else {
        setParticipants(participants.docs.map(doc => doc.data() as Participant))
      }
    }

    loadEvent().catch(console.error)
    loadParticipants().catch(console.error)

    return function CleanUp () {
      eventUbsub()
      participantsUnsub()
    }
  }, [])

  if (!event) return (<Typography>Loading...</Typography>)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  async function handleOwnParticipantStateChange (event: SelectChangeEvent) {
    const state = event.target.value as ParticipantState
    const uid = auth.currentUser?.uid
    const q = query(collection(firestore, 'eventparticipants'),
      where('eid', '==', id),
      where('uid', '==', uid))
    const participants = await getDocs(q)
    if (!participants.empty || participants.docs.length === 1) {
      await changeStateOfParticipant(participants.docs[0].id, state)
    } else {
      throw new Error('Could not find participant')
    }
  }

  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid2 container style={{ width: '100%' }}>
          <Grid2 xs={12} alignItems='end' md={8}>
            <Typography variant='h2'>{event.title}</Typography>
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
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <KeyTableCell>
                        Start
                      </KeyTableCell>
                      <TableCell>
                        {event.start.toDate().toDateString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <KeyTableCell>
                        Ende
                      </KeyTableCell>
                      <TableCell>
                        {event.end.toDate().toDateString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <KeyTableCell>
                        Ort
                      </KeyTableCell>
                      <TableCell>
                        <Typography>
                          Irgendwo
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <KeyTableCell>
                        Anzahl Teilnehmer
                      </KeyTableCell>
                      <TableCell>
                        {participants.filter(p => p.state === ParticipantState.COMMITMENT).length}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <KeyTableCell>
                        Meine Teilnahme
                      </KeyTableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <Select
                            id="demo-simple-select"
                            value={ownState as string}
                            variant="standard"
                            onChange={handleOwnParticipantStateChange}
                          >
                            <MenuItem value={'commitment'}>
                              <Chip color="success" size="small" label={'Zusage'}/>
                            </MenuItem>
                            <MenuItem value={'rejected'}>
                              <Chip color="error" size="small" label={'Abgelehnt'}/>
                            </MenuItem>
                            <MenuItem value={'withreservation'}>
                              <Chip color="warning" size="small" label={'Mit Vorbehalt'}/>
                            </MenuItem>
                            <MenuItem value={'outstanding'}>
                              <Chip color="info" size="small" label={'Ausstehend'}/>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
            <DataGrid
              rows={participants}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
        </Card>
      </TabPanel>
    </>
  )
}
