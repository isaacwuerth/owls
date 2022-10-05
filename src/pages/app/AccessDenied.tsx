import { Box } from '@mui/material'
import './AccessDenied.sass'

export function AccessDenied() {
  return (
    <div className={'accessdenied'}>
      <div className={'accessdenied-container'}>
        <Box
          component="h1"
          sx={{ '&:after, &:before': { content: '"Keine Berechtigungen"' } }}
        >
          Keine Berechtigungen
        </Box>
        <p>Sie haben keine Berechtigungen.</p>
      </div>
    </div>
  )
}
