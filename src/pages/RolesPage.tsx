import {
  Box,
  Card,
  CardContent,
  Zoom,
  Typography,
  useMediaQuery,
  useTheme,
  CardHeader,
  Grow,
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
import { ViewButton } from '../components/permissions/ViewButton'
import { Can, ProtectedRoute } from '../Context/AuthorizationContext'

export function RolesPageInner() {
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
        <Grow in={isDesktop} appear={isDesktop} unmountOnExit>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Can I="create" a="role">
              <AddRoleButton />
            </Can>
            <Can I="update" a="role">
              <AbortButton />
              <SavePermissionsButton />
            </Can>
          </Box>
        </Grow>
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
          <Can I="update" a="role">
            <Zoom
              in={hasRoleChanges && !isDesktop}
              appear={!isDesktop}
              unmountOnExit
            >
              <Box>
                <AbortButton />
              </Box>
            </Zoom>
            <Zoom
              in={hasRoleChanges && !isDesktop}
              appear={!isDesktop}
              unmountOnExit
            >
              <Box>
                <SavePermissionsButton />
              </Box>
            </Zoom>
          </Can>
          <Can I="create" a="role">
            <Zoom in={!isDesktop} unmountOnExit>
              <Box>
                <AddRoleButton />
              </Box>
            </Zoom>
          </Can>
        </Box>
      </Box>
      <Grid2 container>
        <Grid2 xs={12}>
          <Card>
            <CardHeader
              title="Berechtigungen bearbeiten"
              action={<ViewButton />}
            />
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

export function RolesPage() {
  return (
    <ProtectedRoute subject="roles" action={['list', 'get']}>
      <RolesPageInner />
    </ProtectedRoute>
  )
}
