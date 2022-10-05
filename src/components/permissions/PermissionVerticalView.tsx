import { useRecoilValue } from 'recoil'
import { rolesState } from '../../atoms/RoleCapabilitiesAtom'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { PermissionCell } from './PermissionCell'
import { Action, Role, Subject } from '../../model/Role'
import { appCapabilities } from './AppCapabilities'

interface PermissionVerticalRowProps {
  subject: Subject
  roles: Role[]
  action: Action
  actionIndex: number
  actionsLength: number
}

function PermissionVerticalRow({
  subject,
  roles,
  action,
  actionIndex,
  actionsLength,
}: PermissionVerticalRowProps) {
  return (
    <TableRow>
      {actionIndex === 0 ? (
        <TableCell
          rowSpan={actionsLength}
          sx={{ borderRight: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Box
            sx={{
              writingMode: actionsLength !== 1 ? 'tb-rl' : null,
              transform: actionsLength !== 1 ? 'rotate(-180deg)' : null,
            }}
          >
            {subject}
          </Box>
        </TableCell>
      ) : null}
      <TableCell
        sx={{
          width: '1px',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {action}
      </TableCell>
      {roles.map((role) => (
        <PermissionCell
          role={role.id as string}
          subject={subject}
          action={action}
        />
      ))}
    </TableRow>
  )
}

export function PermissionVerticalView() {
  const roles = useRecoilValue(rolesState)
  return (
    <TableContainer sx={{ height: '500px' }}>
      <Table sx={{ borderCollapse: 'separate' }}>
        <TableHead
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#FFF',
          }}
        >
          <TableRow
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <TableCell
              sx={{
                width: '18px',
              }}
            ></TableCell>
            <TableCell></TableCell>
            {roles.map((role) => (
              <TableCell>{role.friendlyName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {appCapabilities.map((appCapability) =>
            appCapability.actions.map((action, actionIndex) => (
              <PermissionVerticalRow
                subject={appCapability.subject}
                action={action}
                actionIndex={actionIndex}
                roles={roles}
                actionsLength={appCapability.actions.length}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
