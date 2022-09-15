import { Profile } from '../../model/Profil'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useFirebase } from '../../Context/FirebaseContext'
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { AvatarProfile } from '../../components/Profile/AvatarCurrentUser'

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
      <CardHeader title="Alle Benutzer" />
      <CardContent sx={{ height: 400 }}>
        <DataGrid
          rows={users}
          columns={[
            {
              field: 'firstName',
              headerName: 'Name',
              flex: 1,
              renderCell: (params) => (
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <AvatarProfile profile={params.row} />
                  <Box sx={{ ml: 1 }}>
                    <Link color="inherit" to={String(params.row.id)}>
                      {`${params.row.firstName} ${params.row.lastName}`}
                    </Link>
                    <Typography color="textSecondary" variant="body2">
                      {params.row.eMail}
                    </Typography>
                  </Box>
                </Box>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}
