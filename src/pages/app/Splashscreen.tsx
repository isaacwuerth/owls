import Box from '@mui/material/Box'
import { useRecoilValue } from 'recoil'
import { applicationStateAtom } from '../../atoms/ApplicationState'

export function Splashscreen ({ children }: any) {
  const applicationState = useRecoilValue(applicationStateAtom)

  if (applicationState === 'running') return (children)
  return (
        <Box display='flex' sx={{ width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: 60 }}>
            <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 viewBox="0 0 52 13" enableBackground="new 0 0 0 0" xmlSpace="preserve">
              <circle fill="#000" stroke="none" cx="6" cy="6" r="6">
                <animate
                    attributeName="opacity"
                    dur="1s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.1"/>
              </circle>
                            <circle fill="#000" stroke="none" cx="26" cy="6" r="6">
                <animate
                    attributeName="opacity"
                    dur="1s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.2"/>
              </circle>
                <circle fill="#000" stroke="none" cx="46" cy="6" r="6">
                    <animate
                    attributeName="opacity"
                    dur="1s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.3"/>
              </circle>
            </svg>
            </Box>
        </Box>
  )
}
