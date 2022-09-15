import { Profile } from '../../model/Profil'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useFirebase } from '../../Context/FirebaseContext'

export function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const { usersRepository } = useFirebase()

  useEffect(() => {
    usersRepository
      .findAll()
      .then(setUsers)
      .catch(() => {})
  })

  return (
    <DataGrid
      rows={users}
      columns={[
        {
          field: 'firstName',
        },
      ]}
    />
  )
}
