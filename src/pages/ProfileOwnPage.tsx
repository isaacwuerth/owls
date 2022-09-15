import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { editUserAtom } from '../atoms/EditUser'
import { Loading } from '../common/Loading'
import { useFirebase } from '../Context/FirebaseContext'
import { ProfileForm } from './ProfilForm'

export function ProfileOwnPage() {
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(editUserAtom)
  const {
    usersRepository,
    apps: { auth },
  } = useFirebase()
  useEffect(() => {
    setUser(undefined)
    if (!auth.currentUser?.uid) navigate('/notfound')
    usersRepository
      .findByUID(String(auth.currentUser?.uid))
      .then((users) => setUser(users[0]))
      .catch(() => {})
  }, [])

  if (!user) return <Loading />
  return <ProfileForm />
}
