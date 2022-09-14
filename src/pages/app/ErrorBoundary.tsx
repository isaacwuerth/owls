import './ErrorBoundary.sass'
import { Box } from '@mui/material'

function Span(content: string) {
  return (
    <Box
      component="span"
      sx={{ '&:after, &:before': { content: `"${content}"` } }}
    >
      {content}
    </Box>
  )
}

export function ErrorBoundary() {
  return (
    <div className={'errorboundry'}>
      <div className={'errorboundry-container'}>
        <Box
          component="h1"
          sx={{ '&:after, &:before': { content: '"FEHLER"' } }}
        >
          Fehler
        </Box>
        <p>Die Dinge sind hier ein wenig {Span('unstabil')}</p>
        <p>Komm später wieder vorbei</p>
      </div>
    </div>
  )
}
