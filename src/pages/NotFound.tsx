import { Box, Button, Typography } from '@mui/material'
import NotFoundImage from './404.gif'

export function NotFound() {
  return (
    <Box
      display="flex"
      sx={{
        height: '100vh',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Box>
        <Typography variant="h1">404</Typography>
        <img
          src={NotFoundImage}
          alt="Not found image"
          style={{ width: '100%' }}
        />

        <Typography variant="h2">Looks like you are lost</Typography>
        <Typography variant="body1">
          he page you are looking for not avaible!
        </Typography>
        <Button sx={{ width: 120 }} variant="outlined" href="/">
          Go to Home
        </Button>
      </Box>
    </Box>
  )
}
