import { InfoTable, InfoTableRow } from '../../common/InfoTable'
import { Card, Typography } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { siteConfigAtom } from '../../atoms/SiteConfigAtom'
import { profileAtom } from '../../atoms/ProfileAtom'
import ENV from '../../env'

const table: InfoTableRow[] = [
  { label: 'NODE_ENV', value: ENV.MODE },
  { label: 'REACT_APP_NAME', value: ENV.VITE_NAME },
  { label: 'REACT_APP_VERSION', value: ENV.VITE_VERSION },
  {
    label: 'REACT_APP_FIREBASE_API_KEY',
    value: ENV.VITE_FIREBASE_API_KEY,
  },
  {
    label: 'REACT_APP_FIREBASE_AUTH_DOMAIN',
    value: ENV.VITE_FIREBASE_AUTH_DOMAIN,
  },
  {
    label: 'REACT_APP_FIREBASE_DATABASE_URL',
    value: ENV.VITE_FIREBASE_DATABASE_URL,
  },
  {
    label: 'REACT_APP_FIREBASE_PROJECT_ID',
    value: ENV.VITE_FIREBASE_PROJECT_ID,
  },
  {
    label: 'REACT_APP_FIREBASE_STORAGE_BUCKET',
    value: ENV.VITE_FIREBASE_STORAGE_BUCKET,
  },
  {
    label: 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    value: ENV.VITE_FIREBASE_MESSAGING_SENDER_ID,
  },
  {
    label: 'REACT_APP_FIREBASE_APP_ID',
    value: ENV.VITE_FIREBASE_APP_ID,
  },
  {
    label: 'REACT_APP_FIREBASE_MEASUREMENT_ID',
    value: ENV.VITE_FIREBASE_MEASUREMENT_ID,
  },
  {
    label: 'REACT_APP_SENTRY_ENVIRONMENT',
    value: ENV.VITE_SENTRY_ENVIRONMENT,
  },
  { label: 'REACT_APP_SENTRY_DSN', value: ENV.VITE_SENTRY_DSN },
  {
    label: 'REACT_APP_OPENREPLAY_PROJECTKEY',
    value: ENV.VITE_OPENREPLAY_PROJECTKEY,
  },
]

function objectToInfoTableRow(obj: object): InfoTableRow[] {
  const entries = Object.entries(obj)
  return entries.map((value) => {
    return { label: value[0], value: String(value[1]) }
  })
}

export function AppInfoPage() {
  const siteConfig = useRecoilValue(siteConfigAtom)
  const profile = useRecoilValue(profileAtom)
  return (
    <Card>
      <Typography variant="h2">Environment Variables</Typography>
      <InfoTable table={table} />
      <Typography variant="h2">Environment Variables</Typography>
      <InfoTable table={objectToInfoTableRow(siteConfig)} />
      <Typography variant="h2">Current User</Typography>
      <InfoTable table={objectToInfoTableRow(profile)} />
    </Card>
  )
}
