import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  hasRolesChanges,
  modifiedRolesState,
  rolesDefaultState,
  rolesState,
} from '../../atoms/RoleCapabilitiesAtom'
import { getRecoil } from 'recoil-nexus'
import { useFirebase } from '../../Context/FirebaseContext'
import { Button, Fab, useMediaQuery, useTheme } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { ForwardedRef, forwardRef } from 'react'

function SavePermissionsButtonInner(
  props: any,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const hasRoleChanges = useRecoilValue(hasRolesChanges)
  const roles = useRecoilValue(rolesState)
  const setDefaultRoles = useSetRecoilState(rolesDefaultState)
  const modifiedRoles = getRecoil(modifiedRolesState)
  const { roleRepository } = useFirebase()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const handleSubmit = () => {
    modifiedRoles.forEach(
      async (role) => await roleRepository.update(role.id as string, role)
    )
    setDefaultRoles(roles)
  }

  return (
    <>
      {isDesktop ? (
        <Button
          ref={ref}
          disabled={!hasRoleChanges}
          variant="contained"
          onClick={handleSubmit}
          color="success"
          startIcon={<SaveIcon />}
        >
          Speichern
        </Button>
      ) : (
        <Fab
          ref={ref}
          color="success"
          onClick={handleSubmit}
          aria-label="Speichern"
        >
          <SaveIcon />
        </Fab>
      )}
    </>
  )
}

export const SavePermissionsButton = forwardRef(SavePermissionsButtonInner)
