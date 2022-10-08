import { ReactElement, useEffect, useState } from 'react'
import { Action, Scopes, Subject } from '../../model/Role'
import { Checkbox, TableCell, useTheme } from '@mui/material'
import { useRecoilState } from 'recoil'
import { capabilityState } from '../../atoms/RoleCapabilitiesAtom'
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import FeedIcon from '@mui/icons-material/Feed'
import { useAbility } from '../../Context/AuthorizationContext'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'

interface CellStateProps {
  backgroundColor?: string
  checkboxIcon?: ReactElement
  color?: string
}

interface PermissionCellProps {
  role: string
  subject: Subject
  action: Action
  sx?: SxProps<Theme>
}

export function PermissionCell({
  role,
  subject,
  action,
  sx,
}: PermissionCellProps): ReactElement {
  const theme = useTheme()
  const ability = useAbility()
  const [scope, setScope] = useRecoilState(
    capabilityState({ role, subject, action })
  )
  const [checkboxState, setCheckboxState] = useState<CellStateProps>({
    checkboxIcon: undefined,
    backgroundColor: undefined,
    color: undefined,
  })

  function handleCheckboxClick() {
    const index = (Scopes.findIndex((v) => v === scope) + 1) % Scopes.length
    setScope(Scopes[index])
  }

  useEffect(() => {
    const states = {
      all: {
        checkboxIcon: <DynamicFeedIcon />,
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
      },
      own: {
        checkboxIcon: <FeedIcon />,
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
      },
      none: {
        checkboxIcon: undefined,
        backgroundColor: undefined,
        color: undefined,
      },
    }
    setCheckboxState(states[scope])
  }, [scope])

  return (
    <TableCell
      align="center"
      style={{
        backgroundColor: checkboxState.backgroundColor,
        padding: 0,
      }}
      sx={sx}
    >
      <Checkbox
        key={`checkbox-${role}-${subject}-${action}`}
        checkedIcon={checkboxState.checkboxIcon}
        checked={Boolean(checkboxState.checkboxIcon)}
        onClick={handleCheckboxClick}
        style={{ color: checkboxState.color, padding: 0 }}
        disabled={!ability.can('edit', 'roles')}
      />
    </TableCell>
  )
}
