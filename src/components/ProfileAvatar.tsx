import { Avatar } from '@mui/material'
import React, { useEffect } from 'react'
import { useFirebase } from '../Context/FirebaseContext'
import { useRecoilState } from 'recoil'
import { avatarAtom } from '../atoms/AvatarAtom'

function stringToColor (string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */
  return color
}

function stringAvatar (name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  }
}

export function ProfileAvatar () {
  const [avatar, setAvatar] = useRecoilState(avatarAtom)
  const { avatarFiles, apps: { auth } } = useFirebase()
  useEffect(() => {
    if (auth.currentUser?.photoURL && auth.currentUser?.displayName) {
      console.log(auth.currentUser?.photoURL)

      avatarFiles.getDownloadUrl(auth.currentUser?.photoURL)
        .then(url => setAvatar({
          // @ts-expect-error
          filename: auth.currentUser?.photoURL,
          dowloadUrl: url
        }))
        .catch(console.error)
    }
  }, [])
  if (avatar) {
    return <Avatar alt={auth.currentUser?.displayName ?? ''} src={avatar.dowloadUrl}/>
  }
  return (
    <Avatar {...stringAvatar(auth.currentUser?.displayName ?? 'A A')} />
  )
}
