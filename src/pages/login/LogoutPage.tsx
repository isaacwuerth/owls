import { useFirebase } from '../../Context/FirebaseContext'
import { useEffect } from 'react'

export function LogoutPage () {
  const firebase = useFirebase()
  useEffect(() => {
    async function signOut () {
      await firebase.apps.auth.signOut()
    }

    signOut().catch(console.error)
  }, [])
  return null
}
