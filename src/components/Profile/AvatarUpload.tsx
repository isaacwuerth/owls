import { ProfileAvatar } from '../ProfileAvatar'
import { Box, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import React, { ChangeEvent } from 'react'
import { useRecoilState } from 'recoil'
import { useFirebase } from '../../Context/FirebaseContext'
import { getAuth, updateProfile } from 'firebase/auth'
import { avatarAtom } from '../../atoms/AvatarAtom'

export function AvatarUpload () {
  const [avatar, setAvatar] = useRecoilState(avatarAtom)
  const { avatarFiles, apps: { auth }, firebase } = useFirebase()

  async function handleFileUpload (e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files == null) return
    console.debug(e.target.files[0])
    const file = e.target.files[0]
    const fileextension = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2).toLocaleLowerCase()
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `${auth.currentUser?.uid}.${fileextension}`
    await avatarFiles.upload(url, file)
    setAvatar({
      filename: url,
      dowloadUrl: await avatarFiles.getDownloadUrl(url)
    })
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: url })
      auth = getAuth(firebase.app)
    }
    e.target.value = ''
  }

  async function handleDeleteProfileImage () {
    if (!avatar) return
    await avatarFiles.delete(avatar?.filename)
    if (auth.currentUser?.photoURL != null) {
      await updateProfile(auth.currentUser, { photoURL: null })
    }
  }

  return (<Box display="flex">
            <ProfileAvatar/>
            <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{ marginRight: '1rem' }}
            >
                Upload CSV
                <input type="file" accept="*.*" hidden onChange={handleFileUpload} />
            </Button>
            <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteProfileImage}
            >
                Löschen
            </Button>
        </Box>
  )
}
