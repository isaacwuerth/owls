import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { editUserAtom } from '../../atoms/EditUser'
import { Loading } from '../../common/Loading'
import { useFirebase } from '../../Context/FirebaseContext'
import { ProfileForm } from '../ProfilForm'
import { ProtectedRoute } from '../../Context/AuthorizationContext'

function UserPage() {
  const { id } = useParams()
  const [user, setUser] = useRecoilState(editUserAtom)
  const { usersRepository } = useFirebase()
  useEffect(() => {
    setUser(undefined)
    usersRepository
      .findOne(String(id))
      .then(setUser)
      .catch(() => {})
  }, [])

  if (!user) return <Loading />
  return (
    <ProtectedRoute subject="users" action="get" this={user}>
      <ProfileForm />
    </ProtectedRoute>
  )
}

export default UserPage
