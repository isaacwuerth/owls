import { Role } from '../../model/Role'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { rolesDefaultState, rolesState } from '../../atoms/RoleCapabilitiesAtom'
import { useFirebase } from '../../Context/FirebaseContext'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TableCell,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface DeleteButtonCellProps {
  role: Role
}

export function DeleteButtonCell({
  role: roleToDelete,
}: DeleteButtonCellProps) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useRecoilState(rolesState)
  const [defaultRoles, setDefaultRoles] = useRecoilState(rolesDefaultState)
  const { roleRepository } = useFirebase()

  function handleDeleteConsent() {
    setOpen(true)
  }

  function handleAbort() {
    setOpen(false)
  }

  function handleDelete() {
    void roleRepository.delete(roleToDelete.id as string)
    const newDefaultRoles = defaultRoles.filter(
      (role) => role.id !== roleToDelete.id
    )
    const newRoles = roles.filter((role) => role.id !== roleToDelete.id)

    setDefaultRoles(newDefaultRoles)
    setRoles(newRoles)
    setOpen(false)
  }

  return (
    <TableCell>
      <IconButton
        sx={{ color: 'red', padding: 0 }}
        onClick={handleDeleteConsent}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle title="Löschen" style={{ color: 'red' }} />
        <DialogContent>
          Möchten Sie wirklich '{roleToDelete.friendlyName}' löschen?
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleAbort}>
            Abbrechen
          </Button>
          <Button
            autoFocus
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </TableCell>
  )
}
