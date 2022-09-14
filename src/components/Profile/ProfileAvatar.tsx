import { Avatar } from '@mui/material'
import React from 'react'
import { useRecoilState } from 'recoil'
import { profileAtom } from '../../atoms/ProfileAtom'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'
import { mergeDeep } from '../../utils/deepMerge'

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

interface ProfileAvatarProps {
  sx?: SxProps<Theme>
}

export function ProfileAvatar (props: ProfileAvatarProps) {
  const [profile] = useRecoilState(profileAtom)
  props = mergeDeep(stringAvatar(`${profile.firstName} ${profile.lastName}`), props)
  if (profile.photoURL) {
    return (
    <Avatar
        {...props}
        alt={`${profile.firstName} ${profile.lastName}`}
        src={profile.photoURL}
    />
    )
  }
  return (
    <Avatar {...props}/>
  )
}
