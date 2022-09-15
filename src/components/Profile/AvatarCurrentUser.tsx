import { Avatar } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import { useRecoilValue } from 'recoil'
import { profileAtom } from '../../atoms/ProfileAtom'
import { Profile } from '../../model/Profil'

function stringToColor(string: string) {
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

interface ProfileAvatarProps {
  sx?: SxProps<Theme>
}

interface AvatarProfileProps extends ProfileAvatarProps {
  profile: Profile | undefined
}

export function AvatarProfile({ profile, sx }: AvatarProfileProps) {
  const name = `${profile?.firstName ?? 'A'} ${profile?.lastName ?? 'A'}`
  return (
    <Avatar
      sx={{
        bgcolor: stringToColor(name),
        ...sx,
      }}
      alt={name}
      src={profile?.photoURL}
    >{`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`}</Avatar>
  )
}

export function AvatarCurrentUser(props: ProfileAvatarProps) {
  const profile = useRecoilValue(profileAtom)
  return <AvatarProfile profile={profile} {...props} />
}
