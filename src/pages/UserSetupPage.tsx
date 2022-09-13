import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { AvatarUpload } from '../components/Profile/AvatarUpload'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import CountrySelect from '../components/Profile/CountrySelect'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { ProfilModel } from '../model/ProfilModel'
import { useSetRecoilState } from 'recoil'
import { profileAtom } from '../atoms/ProfileAtom'
import { useFirebase } from '../Context/FirebaseContext'
import { updateProfile } from 'firebase/auth'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { removeEmpty } from '../utils/removeEmpty'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export function UserSetupPage () {
  const navigate = useNavigate()
  const setProfileState = useSetRecoilState(profileAtom)
  const { apps: { auth, firestore } } = useFirebase()
  const {
    control,
    handleSubmit,
    reset,
    formState
  } = useForm<ProfilModel>()
  const onSubmit = async (profile: ProfilModel) => {
    try {
      if (!auth.currentUser) console.error('There was a error with the profile update')
      profile.eMail = auth.currentUser?.email ?? ''
      profile.uid = auth.currentUser?.uid ?? ''
      // @ts-expect-error
      profile.birthday = profile.birthday?.toDateString()

      // @ts-expect-error
      await updateProfile(auth.currentUser, {
        displayName: `${profile.firstName} ${profile.lastName}`
      })
      setProfileState(profile)
      await addDoc(collection(firestore, 'users'), removeEmpty(profile)).catch(reason => toast(reason))
      navigate('/')
    } catch (e: any) {
      toast(e.message)
    }
  }

  useEffect(() => {
    async function CheckIfUserExistAndRedirectToProfilePage () {
      // @ts-expect-error
      const q = query(collection(firestore, 'users'), where('id', '==', auth.currentUser.uid))
      const docs = await getDocs(q)
      if (docs.size > 1) throw new Error('There are multiple users with the same UID')
      if (docs.size === 1) {
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
          <Grid item columnSpacing={3}>
            <AvatarUpload/>
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: true,
                minLength: {
                  value: 1,
                  message: 'Bitte im min einen Buchstaben eingeben'
                }
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Vorname"
                  type="text"
                  error={Boolean(formState.errors[field.name])}
                  helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Bitte einen Vornamen eingeben'}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="lastName"
              rules={{
                required: true,
                minLength: {
                  value: 1,
                  message: 'Bitte im min einen Buchstaben eingeben'
                }
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Geburtstag"
                  type="text"
                  error={Boolean(formState.errors[field.name])}
                  helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Bitte einen Geburtstags eingeben'}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="birthday"
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  label="Geburtstag"
                  renderInput={(params) => <TextField
                    error={Boolean(formState.errors[field.name])}
                    helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Bitte einen Nachnamen eingeben'}
                    {...params}
                  />}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="street"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Strasse und Hausnummer"
                  type="text"
                  error={Boolean(formState.errors[field.name])}
                  helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Ihre private Addresse für den Briefversand'}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="postcode"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="PLZ"
                  type="text"
                  error={Boolean(formState.errors[field.name])}
                  helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Die Postleitzahl ihrer Wohnorts'}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Wohnort"
                  type="text"
                  error={Boolean(formState.errors[field.name])}
                  helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Ihr Wohnort'}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountrySelect
                  fullWidth
                  label="Land"
                  error={Boolean(formState.errors[field.name])}
                  helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Das Land ihrers Wohnorts'}
                  {...field}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

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
