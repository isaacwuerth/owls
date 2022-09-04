import { Box, Card, CardContent, CardHeader, useTheme } from '@mui/material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { ParticipantState, translationTableColors, translationTableEnum } from '../../enum/ParticipantState'
import { Participant } from '../../model/GeneralEvent'

function countParticipants (participants: Participant[], state: ParticipantState): number {
  return participants.filter(p => p.state === state).length
}

interface ChartParticipantStateProps {
  participants: Participant[]
}

export function ChartParticipantState ({ participants }: ChartParticipantStateProps) {
  const theme = useTheme()

  function ColorOfState (state: ParticipantState) {
    // @ts-expect-error
    return theme.palette[translationTableColors[state]].main
  }

  const options: ApexOptions = {
    series: [countParticipants(participants, ParticipantState.COMMITMENT),
      countParticipants(participants, ParticipantState.WITHRESERVATION),
      countParticipants(participants, ParticipantState.REJECTED),
      countParticipants(participants, ParticipantState.OUTSTANDING)
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

  return <Card style={{ width: '100%', height: '100%' }}>
    <CardHeader title='Teilnehmer Statistik'/>
    <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 120px)' }}>
      {participants.length === 0
        ? <Box >Keine Teilnehmer</Box>
        : <Chart
          options={options}
          series={options.series}
          type='pie'
        />
      }
    </CardContent>
  </Card>
}
