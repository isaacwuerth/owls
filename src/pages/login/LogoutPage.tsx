import { useFirebase } from '../../Context/FirebaseContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function LogoutPage() {
  const firebase = useFirebase()
  const navigate = useNavigate()
  useEffect(() => {
    if (firebase.apps.auth.currentUser) {
      void firebase.apps.auth.signOut()
    }
    navigate('/login')
  }, [])
  return null
}
