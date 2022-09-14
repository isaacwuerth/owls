import { ProfileAvatar } from './ProfileAvatar'
import { Box, Button, CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import React, { ChangeEvent, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useFirebase } from '../../Context/FirebaseContext'
import { updateProfile } from 'firebase/auth'
import { profileAtom } from '../../atoms/ProfileAtom'
import { deleteField } from 'firebase/firestore'

export function AvatarUpload () {
  const [profile, setProfile] = useRecoilState(profileAtom)
  const { avatarFiles, usersRepository, apps: { auth } } = useFirebase()
  const [blocked, setBlocked] = useState<boolean>(false)

  async function handleFileUpload (e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files == null) return
    setBlocked(true)
    const file = e.target.files[0]
    const fileExtension = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2).toLocaleLowerCase()
    const url = `${profile.uid}.${fileExtension}`
    await avatarFiles.upload(url, file)
    const downloadUrl = await avatarFiles.getDownloadUrl(url)
    setProfile(oldProfile => {
      return {
        ...oldProfile,
        photoURL: downloadUrl
      }
    })

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: downloadUrl })
    }
    if (profile?.id) {
      await usersRepository.update(profile.id, { ...profile, photoURL: downloadUrl })
    } else {
      await usersRepository.create({ ...profile, photoURL: downloadUrl })
    }
    setBlocked(false)
  }

  async function handleDeleteProfileImage () {
    if (!profile?.photoURL) return
    setBlocked(true)
    const uri = decodeURI(profile.photoURL)
    const regex = /\/o\/avatar%2F(?<photo>\w+.\w+)/
    // @ts-expect-error
    const photo = uri.match(regex).groups.photo
    await avatarFiles.delete(photo)
    if (auth.currentUser) {
      const oldProfile = { ...profile, photoURL: undefined }
      await updateProfile(auth.currentUser, { photoURL: null })
      // @ts-expect-error
      await usersRepository.update(profile.id, { ...profile, photoURL: deleteField() })
      setProfile(oldProfile)
    }
    setBlocked(false)
  }

  return (
      <Box display="flex">
          <Box style={{ marginRight: 10 }}>
              {blocked ? <CircularProgress /> : <ProfileAvatar/>}
          </Box>
          <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon/>}
                sx={{ marginRight: '1rem' }}
                disabled={blocked}
            >
                Hochladen
                <input type="file" accept="image/*" hidden onChange={handleFileUpload}/>
            </Button>
            <Button
                variant="outlined"
                startIcon={<DeleteIcon/>}
                onClick={handleDeleteProfileImage}
                disabled={blocked}
            >
                Löschen
            </Button>
        </Box>
  )
}
