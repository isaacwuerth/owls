import { useFirebase } from '../../Context/FirebaseContext'
import { useEffect } from 'react'
import { Box } from '@mui/material'
import 'firebaseui/dist/firebaseui.css'
import { Logo } from '../../common/Logo'

export function LoginPage () {
  const { apps: { loginUi }, uiConfig } = useFirebase()

  useEffect(() => {
    loginUi.start('#firebase-login-ui', uiConfig)
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', height: '100%' }}>
      <Logo width='100px'/>
      <Box component="div" id="firebase-login-ui"/>
    </Box>
  )
}
