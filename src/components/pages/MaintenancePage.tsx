import React, { PropsWithChildren } from 'react'
import { useRecoilValue } from 'recoil'
import { siteConfigAtom } from '../../atoms/SiteConfigAtom'
import { Box, Typography } from '@mui/material'

export function MaintenancePage ({ children }: PropsWithChildren<{}>) {
  const { maintenanceMode } = useRecoilValue(siteConfigAtom)
  return (
    <> {
      maintenanceMode
        ? <Box>
          <Typography>Maintenace Mode</Typography>
        </Box>
        : children
    }
    </>
  )
}
