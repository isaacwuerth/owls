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
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'inherit',
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
      }}
    >
      <Table
        sx={{
          borderCollapse: 'separate',
          backgroundColor: 'inherit',
          backgroundImage: 'inherit',
        }}
      >
        <TableHead
          sx={{
            backgroundColor: 'inherit',
            backgroundImage: 'inherit',
          }}
        >
          <TableRow
            sx={{
              position: 'sticky',
              top: theme.mixins.toolbar.height,
              backgroundColor: 'inherit',
              backgroundImage: 'inherit',
            }}
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
                backgroundColor: 'inherit',
                backgroundImage: 'inherit',
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
          <TableRow
            sx={{ backgroundColor: 'inherit', backgroundImage: 'inherit' }}
          >
            <Can I="delete" a="role">
              <TableCell> </TableCell>
            </Can>
            <TableCell
              sx={{
                position: 'sticky',
                left: 0,
                zIndex: 1,
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                backgroundColor: 'inherit',
                backgroundImage: 'inherit',
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
        <TableBody
          sx={{ backgroundColor: 'inherit', backgroundImage: 'inherit' }}
        >
          {roles.map((role, index) => (
            <TableRow
              key={`row-${index}`}
              sx={{
                backgroundColor: 'inherit',
                backgroundImage: 'inherit',
              }}
            >
              <Can I="delete" a="role">
                <DeleteButtonCell role={role} />
              </Can>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                  backgroundColor: 'inherit',
                  backgroundImage: 'inherit',
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
                    sx={{
                      borderRight: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
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
