import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Button, CircularProgress } from '@mui/material'
import { deleteField } from 'firebase/firestore'
import { ChangeEvent, useState } from 'react'
import { useRecoilState } from 'recoil'
import { editUserAtom } from '../../atoms/EditUser'
import { profileAtom } from '../../atoms/ProfileAtom'
import { useFirebase } from '../../Context/FirebaseContext'
import { AvatarProfile } from './AvatarCurrentUser'

export function AvatarUpload() {
  const [editUser, setEditUser] = useRecoilState(editUserAtom)
  const [currentUser, setCurrentUser] = useRecoilState(profileAtom)
  const { avatarFiles, usersRepository } = useFirebase()
  const [blocked, setBlocked] = useState<boolean>(false)

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!editUser) throw new Error('profileState is undefined')
    if (e.target.files == null) return
    setBlocked(true)
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
    setBlocked(false)
  }

  async function handleDeleteProfileImage() {
    if (!editUser) throw new Error('profileState is undefined')
    if (!editUser?.photoURL) return
    setBlocked(true)
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
    setBlocked(false)
  }

  return (
    <Box display="flex">
      <Box style={{ marginRight: 10 }}>
        {blocked ? (
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
        disabled={blocked}
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
        disabled={blocked}
      >
        Löschen
      </Button>
    </Box>
  )
}
