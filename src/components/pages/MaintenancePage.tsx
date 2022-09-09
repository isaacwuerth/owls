import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { siteConfigAtom } from '../../atoms/SiteConfigAtom'
import { Box, Card, Typography } from '@mui/material'
import './Maintenance.sass'
import { calculateTimeLeft, Counter } from '../counter/Counter'

interface MaintenanceProps {
  title: string
  message: string
  endDate?: Date
}

function Maintenance ({ title, message, endDate }: MaintenanceProps) {
  if (endDate) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate))
    useEffect(() => {
      if (!endDate) return
      setTimeout(() => {
        if (timeLeft.difference < 0) {
          window.location.reload()
        }
        setTimeLeft(calculateTimeLeft(endDate))
      }, 1000)
    }, [timeLeft])
  }

  return (
    <Box sx={{
      backgroundImage: 'url(/img/maintenance.jpg)'
    }}
         className={'holder'}
    >
      <Card className='background'>
        <Typography fontSize='24px' fontWeight='bolder'>{title}</Typography>
          <p>{message}</p>
          {endDate ? <Counter endDate={endDate}/> : null}
      </Card>
    </Box>
  )
}

export function MaintenancePage ({ children }: PropsWithChildren<{}>) {
  const { maintenanceMode, maintenanceMessage, maintenanceEnd, maintenanceTitle } = useRecoilValue(siteConfigAtom)
  const timedifference = maintenanceEnd ? new Date(maintenanceEnd).getTime() - new Date().getTime() : 0
  // eslint-disable-next-line no-unreachable
  if (maintenanceMode === 'permanent') {
    return <Maintenance message={maintenanceMessage} title={maintenanceTitle}/>
  } else if (maintenanceMode === 'scheduled') {
    if (timedifference > 0) return <Maintenance message={maintenanceMessage} title={maintenanceTitle} endDate={maintenanceEnd}/>
  }
  return <>{children}</>
}
