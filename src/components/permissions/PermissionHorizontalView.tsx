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
import { Can } from '../../Context/AuthorizationContext'

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
            <Can I="delete" a="role">
              <TableCell></TableCell>
            </Can>
            <TableCell
              sx={{
                width: 120,
                position: 'sticky',
                left: 0,
                zIndex: 1,
                backgroundColor: (theme) => theme.palette.background.default,
                backgroundImage:
                  'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
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
            <Can I="delete" a="role">
              <TableCell> </TableCell>
            </Can>
            <TableCell
              sx={{
                position: 'sticky',
                left: 0,
                zIndex: 1,
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                backgroundColor: (theme) => theme.palette.background.default,
                backgroundImage:
                  'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
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
              <Can I="delete" a="role">
                <DeleteButtonCell role={role} />
              </Can>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                  backgroundColor: (theme) => theme.palette.background.default,
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
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
