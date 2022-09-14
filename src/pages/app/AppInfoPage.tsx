import { InfoTable, InfoTableRow } from '../../common/InfoTable'
import { Card, Typography } from '@mui/material'

const table: InfoTableRow[] = [
  { label: 'NODE_ENV', value: process.env.NODE_ENV },
  { label: 'REACT_APP_NAME', value: process.env.REACT_APP_NAME },
  { label: 'REACT_APP_VERSION', value: process.env.REACT_APP_VERSION },
  { label: 'REACT_APP_FIREBASE_API_KEY', value: process.env.REACT_APP_FIREBASE_API_KEY },
  { label: 'REACT_APP_FIREBASE_AUTH_DOMAIN', value: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN },
  { label: 'REACT_APP_FIREBASE_DATABASE_URL', value: process.env.REACT_APP_FIREBASE_DATABASE_URL },
  { label: 'REACT_APP_FIREBASE_PROJECT_ID', value: process.env.REACT_APP_FIREBASE_PROJECT_ID },
  { label: 'REACT_APP_FIREBASE_STORAGE_BUCKET', value: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET },
  { label: 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID', value: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID },
  { label: 'REACT_APP_FIREBASE_APP_ID', value: process.env.REACT_APP_FIREBASE_APP_ID },
  { label: 'REACT_APP_FIREBASE_MEASUREMENT_ID', value: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID },
  { label: 'REACT_APP_SENTRY_ENVIRONMENT', value: process.env.REACT_APP_SENTRY_ENVIRONMENT },
  { label: 'REACT_APP_SENTRY_DSN', value: process.env.REACT_APP_SENTRY_DSN },
  { label: 'REACT_APP_OPENREPLAY_PROJECTKEY', value: process.env.REACT_APP_OPENREPLAY_PROJECTKEY }
]

export function AppInfoPage () {
  return (
        <Card>
            <Typography variant='h2'>Environment Variables</Typography>
            <InfoTable table={table}/>
        </Card>
  )
}
