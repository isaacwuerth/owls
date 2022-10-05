import {
  Box,
  Card,
  CardContent,
  Zoom,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useFirebase } from '../Context/FirebaseContext'
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  hasRolesChanges,
  rolesDefaultState,
  rolesState,
} from '../atoms/RoleCapabilitiesAtom'
import Grid2 from '@mui/material/Unstable_Grid2'
import { permissionTableViewState } from '../atoms/PermissionTableViewState'
import { SavePermissionsButton } from '../components/permissions/SavePermissionsButton'
import { AbortButton } from '../components/permissions/AbortButton'
import { AddRoleButton } from '../components/permissions/AddRoleButton'
import { PermissionHorizontalView } from '../components/permissions/PermissionHorizontalView'
import { PermissionVerticalView } from '../components/permissions/PermissionVerticalView'

export function RolesPage() {
  const setRoles = useSetRecoilState(rolesState)
  const setDefaultRoles = useSetRecoilState(rolesDefaultState)
  const view = useRecoilValue(permissionTableViewState)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const hasRoleChanges = useRecoilValue(hasRolesChanges)
  const { roleRepository } = useFirebase()

  useEffect(() => {
    void roleRepository.findAll().then((roles) => {
      setRoles(roles)
      setDefaultRoles(roles)
    })
  }, [])

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h2">Rollen</Typography>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {isDesktop && (
            <>
              <AddRoleButton />
              <AbortButton />
              <SavePermissionsButton />
            </>
          )}
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Zoom in={hasRoleChanges && !isDesktop} unmountOnExit>
              <AbortButton />
            </Zoom>
            <Zoom in={hasRoleChanges && !isDesktop} unmountOnExit>
              <SavePermissionsButton />
            </Zoom>
          </Box>
          <Zoom in={!hasRoleChanges && !isDesktop} unmountOnExit>
            <AddRoleButton />
          </Zoom>
        </Box>
      </Box>
      <Grid2 container>
        <Grid2 xs={12}>
          <Card>
            <CardContent>
              {view === 'vertical' ? (
                <PermissionHorizontalView />
              ) : (
                <PermissionVerticalView />
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}
