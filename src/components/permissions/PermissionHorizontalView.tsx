import { useRecoilValue } from 'recoil'
import { rolesState } from '../../atoms/RoleCapabilitiesAtom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material'
import { DeleteButtonCell } from './DeleteButtonCell'
import { RoleCell } from './RoleCell'
import { PermissionCell } from './PermissionCell'
import { appCapabilities } from './AppCapabilities'

export function PermissionHorizontalView() {
  const roles = useRecoilValue(rolesState)

  const theme = useTheme()
  return (
    <TableContainer
      sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Table
        sx={{
          borderCollapse: 'separate',
        }}
      >
        <TableHead>
          <TableRow
            sx={{ position: 'sticky', top: theme.mixins.toolbar.height }}
          >
            <TableCell></TableCell>
            <TableCell
              sx={{
                width: 120,
                position: 'sticky',
                left: 0,
                zIndex: 1,
                backgroundColor: (theme) => theme.palette.background.default,
              }}
            ></TableCell>
            {appCapabilities.map((capability) => (
              <TableCell
                key={`header-${capability.subject}`}
                colSpan={capability.actions.length}
              >
                {capability.subject}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell
              sx={{
                position: 'sticky',
                left: 0,
                zIndex: 1,
                backgroundColor: (theme) => theme.palette.background.default,
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              Rollen
            </TableCell>
            {appCapabilities.map((capability) =>
              capability.actions.map((action) => (
                <TableCell
                  key={`header-${capability.subject}-${action}`}
                  align="center"
                >
                  {action}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={`row-${index}`}>
              <DeleteButtonCell role={role} />
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  backgroundColor: (theme) => theme.palette.background.default,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <RoleCell role={role} />
              </TableCell>
              {appCapabilities.map((capability) =>
                capability.actions.map((action, index) => (
                  <PermissionCell
                    key={`row-${index}-cell-${capability.subject}-${action}`}
                    role={role.id as string}
                    subject={capability.subject}
                    action={action}
                  />
                ))
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
