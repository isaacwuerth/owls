import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  hasRolesChanges,
  rolesDefaultState,
  rolesState,
} from '../../atoms/RoleCapabilitiesAtom'
import { Button } from '@mui/material'

export function AbortButton() {
  const defaultRoles = useRecoilValue(rolesDefaultState)
  const setRoles = useSetRecoilState(rolesState)
  const hasRoleChanges = useRecoilValue(hasRolesChanges)

  const handleAbort = () => {
    setRoles(defaultRoles)
  }

  return (
    <Button disabled={!hasRoleChanges} variant="outlined" onClick={handleAbort}>
      Reset
    </Button>
  )
}
