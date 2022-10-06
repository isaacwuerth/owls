import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Button, CircularProgress } from '@mui/material'
import { deleteField } from 'firebase/firestore'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { editUserAtom } from '../../atoms/EditUser'
import { profileAtom } from '../../atoms/ProfileAtom'
import { useFirebase } from '../../Context/FirebaseContext'
import { AvatarProfile } from './AvatarCurrentUser'

interface AvatarUploadProps {
  disabled?: boolean
}

export function AvatarUpload({ disabled }: AvatarUploadProps) {
  const [editUser, setEditUser] = useRecoilState(editUserAtom)
  const [currentUser, setCurrentUser] = useRecoilState(profileAtom)
  const { avatarFiles, usersRepository } = useFirebase()
  const [blocked, setBlocked] = useState<'loading' | 'disabled' | 'ready'>(
    'disabled'
  )

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!editUser) throw new Error('profileState is undefined')
    if (e.target.files == null) return
    setBlocked('loading')
    const file = e.target.files[0]
    const fileExtension = file.name
      .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      .toLocaleLowerCase()
    const url = `${editUser.uid}.${fileExtension}`
    await avatarFiles.upload(url, file)
    const downloadUrl = await avatarFiles.getDownloadUrl(url)
    const newUser = {
      ...editUser,
      photoURL: downloadUrl,
    }
    if (newUser?.id) {
      await usersRepository.update(newUser.id, newUser)
    } else {
      await usersRepository.create(newUser)
    }
    if (currentUser.id === newUser.id) setCurrentUser(newUser)
    setEditUser(newUser)
    setBlocked('ready')
  }

  async function handleDeleteProfileImage() {
    if (!editUser) throw new Error('profileState is undefined')
    if (!editUser?.photoURL) return
    setBlocked('loading')
    const uri = decodeURI(editUser.photoURL)
    const regex = /\/o\/avatar%2F(?<photo>\w+.\w+)/
    // @ts-expect-error
    const photo = uri.match(regex).groups.photo
    await avatarFiles.delete(photo)
    const newProfile = { ...editUser, photoURL: undefined }
    // @ts-expect-error
    await usersRepository.update(newProfile.id, {
      ...newProfile,
      photoURL: deleteField(),
    })
    setEditUser(newProfile)
    if (currentUser.id === newProfile.id) setCurrentUser(newProfile)
    setBlocked('ready')
  }

  useEffect(() => {
    setBlocked(disabled ? 'disabled' : 'ready')
  }, [disabled])

  return (
    <Box display="flex">
      <Box style={{ marginRight: 10 }}>
        {blocked === 'loading' ? (
          <CircularProgress sx={{ width: 42, height: 42 }} />
        ) : (
          <AvatarProfile profile={editUser} />
        )}
      </Box>
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ marginRight: '1rem' }}
        disabled={blocked === 'disabled' || blocked === 'loading'}
      >
        Hochladen
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileUpload}
        />
      </Button>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={handleDeleteProfileImage}
        disabled={blocked === 'disabled' || blocked === 'loading'}
      >
        Löschen
      </Button>
    </Box>
  )
}
