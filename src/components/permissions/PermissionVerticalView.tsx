import { useRecoilValue } from 'recoil'
import { rolesState } from '../../atoms/RoleCapabilitiesAtom'
import {
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
}

function PermissionVerticalRow({
  subject,
  roles,
  action,
  actionIndex,
}: PermissionVerticalRowProps) {
  return (
    <TableRow>
      {actionIndex === 0 ? (
        <TableCell>{subject}</TableCell>
      ) : (
        <TableCell></TableCell>
      )}
      <TableCell>{action}</TableCell>
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
      <Table>
        <TableHead
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#FFF',
          }}
        >
          <TableRow sx={{ borderBottomStyle: 'solid' }}>
            <TableCell></TableCell>
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
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
