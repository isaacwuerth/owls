import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  hasRolesChanges,
  rolesDefaultState,
  rolesState,
} from '../../atoms/RoleCapabilitiesAtom'
import { Button, Fab, useMediaQuery, useTheme } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

export function AbortButton() {
  const defaultRoles = useRecoilValue(rolesDefaultState)
  const setRoles = useSetRecoilState(rolesState)
  const hasRoleChanges = useRecoilValue(hasRolesChanges)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const handleAbort = () => {
    setRoles(defaultRoles)
  }

  return (
    <>
      {isDesktop ? (
        <Button
          disabled={!hasRoleChanges}
          variant="contained"
          onClick={handleAbort}
          color="error"
          startIcon={<ClearIcon />}
        >
          Reset
        </Button>
      ) : (
        <Fab aria-label="Reset" onClick={handleAbort} color="error">
          <ClearIcon />
        </Fab>
      )}
    </>
  )
}
