import { GeneralEvent } from '../../model/GeneralEvent'
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2'
import './EventList'

interface EventListItemProps {
  event: GeneralEvent
}

function EventListItem({ event }: EventListItemProps) {
  return (
    <Card sx={{ display: 'flex', width: '100%' }}>
      <CardMedia
        sx={{ width: 200, objectFit: 'cover' }}
        component="img"
        image={'https://via.placeholder.com/150'}
      />
      <CardContent sx={{ width: '100%' }}>
        <Grid container>
          <Grid xs={12} sx={{ display: 'inline' }}>
            <Typography variant="h4">
              {event.title + ' '}
              <Chip
                label="HEUTE"
                size="small"
                color="error"
                sx={{ animation: 'blinker 1s linear infinite' }}
              />
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant="caption" sx={{ width: '100%' }}>
              Datum
            </Typography>
            <Typography variant="body1" sx={{ width: '100%' }}>
              {event.start.toLocaleDateString()} -{' '}
              {event.end.toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant="caption" sx={{ width: '100%' }}>
              Ort
            </Typography>
            <Typography variant="body1" sx={{ width: '100%' }}>
              <Box>{event.street}</Box>
              <Box>
                {event.country}-{event.postcode} {event.city}
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardContent></CardContent>
    </Card>
  )
}

interface EventListProps {
  events: GeneralEvent[]
  onDelete: (id: string) => void
}

function EventListInner({ events }: EventListProps) {
  return (
    <List>
      {events.map((event) => (
        <ListItem>
          <EventListItem event={event} />
        </ListItem>
      ))}
    </List>
  )
}

export const EventList = EventListInner
