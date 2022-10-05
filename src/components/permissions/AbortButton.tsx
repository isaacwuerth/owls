import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  hasRolesChanges,
  rolesDefaultState,
  rolesState,
} from '../../atoms/RoleCapabilitiesAtom'
import { Button, Fab, useMediaQuery, useTheme } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { ForwardedRef, forwardRef } from 'react'

function AbortButtonInner(props: any, ref: ForwardedRef<HTMLButtonElement>) {
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
          ref={ref}
          disabled={!hasRoleChanges}
          variant="contained"
          onClick={handleAbort}
          color="error"
          startIcon={<ClearIcon />}
        >
          Reset
        </Button>
      ) : (
        <Fab
          ref={ref}
          size="small"
          aria-label="Reset"
          onClick={handleAbort}
          color="error"
        >
          <ClearIcon />
        </Fab>
      )}
    </>
  )
}

export const AbortButton = forwardRef(AbortButtonInner)
