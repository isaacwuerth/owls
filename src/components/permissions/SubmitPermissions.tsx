import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  hasRolesChanges,
  modifiedRolesState,
  rolesDefaultState,
  rolesState,
} from '../../atoms/RoleCapabilitiesAtom'
import { getRecoil } from 'recoil-nexus'
import { useFirebase } from '../../Context/FirebaseContext'
import { Button } from '@mui/material'

export function SubmitPermissions() {
  const hasRoleChanges = useRecoilValue(hasRolesChanges)
  const roles = useRecoilValue(rolesState)
  const setDefaultRoles = useSetRecoilState(rolesDefaultState)
  const modifiedRoles = getRecoil(modifiedRolesState)
  const { roleRepository } = useFirebase()

  const handleSubmit = () => {
    modifiedRoles.forEach(
      async (role) => await roleRepository.update(role.id as string, role)
    )
    setDefaultRoles(roles)
  }

  return (
    <Button
      disabled={!hasRoleChanges}
      variant="contained"
      onClick={handleSubmit}
    >
      Speichern
    </Button>
  )
}
