import { Profile } from '../../model/Profil'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useFirebase } from '../../Context/FirebaseContext'
import { Card } from '@mui/material'

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
    <Card>
      <DataGrid
        rows={users}
        columns={[
          {
            field: 'firstName',
          },
        ]}
      />
    </Card>
  )
}
