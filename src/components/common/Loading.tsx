import { Box, CircularProgress } from '@mui/material'

export function Loading () {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <CircularProgress/>
    </Box>
  )
}
