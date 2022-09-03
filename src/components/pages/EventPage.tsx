import {
  Box,
  Button,
  Card, CardContent, CardHeader,
  Chip,
  SelectChangeEvent,
  Stack,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  Typography,
  useTheme
} from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, useGridApiContext } from '@mui/x-data-grid'
import { useRecoilValue } from 'recoil'
import { currentEventViewState } from '../../atoms/EventAtom.'
import { ParticipantState } from '../../enum/ParticipantState'
import { OverridableStringUnion } from '@mui/types'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { Participant } from '../../model/GeneralEvent'
import Grid2 from '@mui/material/Unstable_Grid2'

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

const translationTableEnum: { [ParticipantState: string]: string } = {
  [ParticipantState.COMMITMENT]: 'Zusage',
  [ParticipantState.REJECTED]: 'Abgelehnt',
  [ParticipantState.WITHRESERVATION]: 'Mit Vorbehalt',
  [ParticipantState.OUTSTANDING]: 'Ausstehend'
}

const translationTableColors: {
  [ParticipantState: string]: OverridableStringUnion<'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  ChipPropsColorOverrides>
} = {
  [ParticipantState.COMMITMENT]: 'success',
  [ParticipantState.REJECTED]: 'error',
  [ParticipantState.WITHRESERVATION]: 'warning',
  [ParticipantState.OUTSTANDING]: 'info'
}

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
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${params.row.person.firstName || ''} ${params.row.person.lastName || ''}`
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

function countParticipants (participants: Participant[], state: ParticipantState): number {
  return participants.filter(p => p.state === state).length
}

export function EventPage () {
  const event = useRecoilValue(currentEventViewState)
  const [value, setValue] = useState(0)
  const theme = useTheme()

  function ColorOfState (state: ParticipantState) {
    // @ts-expect-error
    return theme.palette[translationTableColors[state]].main
  }

  const options: ApexOptions = {
    series: [countParticipants(event.participants, ParticipantState.COMMITMENT),
      countParticipants(event.participants, ParticipantState.WITHRESERVATION),
      countParticipants(event.participants, ParticipantState.REJECTED),
      countParticipants(event.participants, ParticipantState.OUTSTANDING)
    ],
    legend: {
      position: 'bottom'

    },
    chart: {
      width: '100%',
      type: 'pie'
    },
    dataLabels: {
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex]
      }
    },
    labels: [
      translationTableEnum[ParticipantState.COMMITMENT],
      translationTableEnum[ParticipantState.WITHRESERVATION],
      translationTableEnum[ParticipantState.REJECTED],
      translationTableEnum[ParticipantState.OUTSTANDING]],
    colors:
      [
        ColorOfState(ParticipantState.COMMITMENT),
        ColorOfState(ParticipantState.WITHRESERVATION),
        ColorOfState(ParticipantState.REJECTED),
        ColorOfState(ParticipantState.OUTSTANDING)
      ],
    responsive:
      [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
  }

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h2'>{event.title}</Typography>
        <Stack>
          <Button variant='contained'>Bearbeiten</Button>
        </Stack>
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
                        {event.start.toDateString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <KeyTableCell>
                        Ende
                      </KeyTableCell>
                      <TableCell>
                        {event.end.toDateString()}
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
                        {event.participants.filter(p => p.state === ParticipantState.COMMITMENT).length}
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
                            value={'outstanding'}
                            variant="standard"
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
            <Card style={{ width: '100%', height: '100%' }}>
              <CardHeader title='Teilnehmer Statistik'/>
              <CardContent>
                <Chart
                  options={options}
                  series={options.series}
                  type='pie'
                />
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Card>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={event.participants}
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
