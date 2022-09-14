import { Box, Button, Container, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { Profile, ProfileCreate, ProfileCreateSchema, ProfileSchema } from '../model/Profil'
import { useSetRecoilState } from 'recoil'
import { profileAtom } from '../atoms/ProfileAtom'
import { useFirebase } from '../Context/FirebaseContext'
import { updateProfile } from 'firebase/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/DynamicForm/Input'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { InputType } from '../components/DynamicForm/InputType'

export function UserSetupPage () {
  const navigate = useNavigate()
  const setProfileState = useSetRecoilState(profileAtom)
  const { usersRepository, apps: { auth } } = useFirebase()
  const form = useForm<ProfileCreate>({
    resolver: zodResolver(ProfileCreateSchema),
    defaultValues: { eMail: auth.currentUser?.email ?? '' }
  })
  const {
    handleSubmit,
    reset,
    formState: { errors }
  } = form
  const onSubmit = async (newProfile: any) => {
    try {
      newProfile.eMail = auth.currentUser?.email ?? ''
      newProfile.uid = auth.currentUser?.uid ?? ''
      if (!newProfile.birthday) newProfile.birthday = undefined
      const profile: Profile = ProfileSchema.parse(newProfile)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: `${profile.firstName} ${profile.lastName}`
        })
      }
      const id = await usersRepository.create(profile)
      const user = await usersRepository.findOne(id)
      setProfileState(user)
      navigate('/')
    } catch (e: any) {
      toast(e.message)
      throw e
    }
  }

  useEffect(() => {
    if (!auth?.currentUser?.uid) navigate('/login')
    async function CheckIfUserExistAndRedirectToProfilePage () {
      // @ts-expect-error
      const users = await usersRepository.findByUID(auth.currentUser.uid)
      if (users.length > 1) throw new Error('There are multiple users with the same UID')
      if (users.length === 1) {
        navigate('/profile')
      }
    }

    CheckIfUserExistAndRedirectToProfilePage().catch(reason => toast(reason))
  }, [])

  return (
    <Container>
      <Typography variant="h1">Benutzer Setup</Typography>
      <Typography>Damit die App benutzt werden kann, benötigen wir einige Informationen von dir.</Typography>
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction='column' spacing={3}>
          <Grid item>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'E-Mail',
              mandatory: true,
              isArray: false,
              name: 'eMail',
              placeholder: '',
              disabled: true
            }}/>
          </Grid>
          <Grid item>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'Vorname',
              mandatory: true,
              isArray: false,
              name: 'firstName',
              placeholder: ''
            }}/>
          </Grid>
          <Grid item>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'Nachname',
              mandatory: true,
              isArray: false,
              name: 'lastName',
              placeholder: ''
            }}/>
          </Grid>
          <Grid item>
            <Input form={form} field={{
              type: InputType.DATE,
              label: 'Geburtstag',
              mandatory: true,
              isArray: false,
              name: 'birthday',
              placeholder: ''
            }}/>
          </Grid>
          <Grid item>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'Strasse und Hausnummer',
              mandatory: true,
              isArray: false,
              name: 'street',
              placeholder: ''
            }}/>
          </Grid>
          <Grid item>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'PLZ',
              mandatory: false,
              isArray: false,
              name: 'postcode',
              placeholder: ''
            }}/>
          </Grid>
          <Grid item>
            <Input form={form} field={{
              type: InputType.STRING,
              label: 'Wohnort',
              mandatory: false,
              isArray: false,
              name: 'city',
              placeholder: ''
            }}/>
          </Grid>
          <Grid item>
            <Input form={form} field={{
              type: InputType.COUNTRY,
              label: 'Land',
              mandatory: false,
              isArray: false,
              name: 'country',
              placeholder: ''
            }}/>
          </Grid>
        </Grid>
      </Box>
      {JSON.stringify(errors)}
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="reset"
                variant="outlined"
                startIcon={<DeleteIcon/>}
                onClick={() => reset()}
                style={{ width: '100%', margin: '5px' }}>
          Abort
        </Button>
        <Button type="submit"
                variant="contained"
                endIcon={<SendIcon/>}
                onClick={handleSubmit(onSubmit)}
                style={{ width: '100%', margin: '5px' }}>
          Run
        </Button>
      </Box>
    </Container>
  )
}
