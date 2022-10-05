import { Card, CardContent, Typography } from '@mui/material'
import { useFirebase } from '../Context/FirebaseContext'
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { rolesDefaultState, rolesState } from '../atoms/RoleCapabilitiesAtom'
import Grid2 from '@mui/material/Unstable_Grid2'
import { permissionTableViewState } from '../atoms/PermissionTableViewState'
import { SubmitPermissions } from '../components/permissions/SubmitPermissions'
import { AbortButton } from '../components/permissions/AbortButton'
import { AddRoleButton } from '../components/permissions/AddRoleButton'
import { ViewButton } from '../components/permissions/ViewButton'
import { PermissionHorizontalView } from '../components/permissions/PermissionHorizontalView'
import { PermissionVerticalView } from '../components/permissions/PermissionVerticalView'

export function RolesPage() {
  const setRoles = useSetRecoilState(rolesState)
  const setDefaultRoles = useSetRecoilState(rolesDefaultState)
  const view = useRecoilValue(permissionTableViewState)
  const { roleRepository } = useFirebase()

  useEffect(() => {
    void roleRepository.findAll().then((roles) => {
      setRoles(roles)
      setDefaultRoles(roles)
    })
  }, [])
  return (
    <>
      <Typography variant="h2">Roles</Typography>
      <AddRoleButton />
      <AbortButton />
      <SubmitPermissions />
      <ViewButton />
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
