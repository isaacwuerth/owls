import { useRecoilState } from 'recoil'
import { roleNameState } from '../../atoms/RoleCapabilitiesAtom'
import { ChangeEvent } from 'react'
import { TextField } from '@mui/material'
import { Role } from '../../model/Role'

interface RoleCellProps {
  role: Role
}

export function RoleCell({ role }: RoleCellProps) {
  const [roleName, setRoleName] = useRecoilState(
    roleNameState(role.id as string)
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoleName(event.currentTarget.value)
  }

  return (
    <TextField
      fullWidth
      variant="standard"
      onChange={handleChange}
      value={roleName}
      sx={{
        border: 0,
        padding: 0,
        margin: 0,
        width: 120,
      }}
      InputProps={{
        disableUnderline: true,
        inputProps: {
          sx: {
            padding: 0,
          },
        },
      }}
    />
  )
}
