import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { profileAtom } from '../atoms/ProfileAtom'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { useState } from 'react'
import { AvatarUpload } from '../components/Profile/AvatarUpload'
import { useFirebase } from '../Context/FirebaseContext'
import { updateProfile } from 'firebase/auth'
import { Profile, ProfileSchema } from '../model/Profil'
import { Input } from '../components/DynamicForm/Input'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { toast } from 'react-toastify'
import { InputType } from '../components/DynamicForm/InputType'

export function ProfilPage() {
  const [profile, setProfileState] = useRecoilState(profileAtom)
  const {
    usersRepository,
    apps: { auth },
  } = useFirebase()
  const [disableForm, setDisableForm] = useState<boolean>(false)
  const form = useForm<Profile>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: profile,
  })
  const { handleSubmit, reset } = form

  const onSubmit = async (newProfile: Profile) => {
    if (!profile?.id) return
    setDisableForm(true)
    newProfile = ProfileSchema.parse(newProfile)
    await usersRepository.update(profile.id, newProfile)
    setProfileState(profile)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: `${newProfile.firstName} ${newProfile.lastName}`,
      })
    }
    toast('Profil wurde aktualisiert', { type: 'success' })
    setDisableForm(false)
  }

  const handleAbort = () => {
    reset(profile)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h2">Profil</Typography>
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="column" spacing={3}>
            <Grid item columnSpacing={3}>
              <AvatarUpload />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.STRING,
                  label: 'UID',
                  mandatory: true,
                  isArray: false,
                  name: 'uid',
                  placeholder: '',
                  disabled: true,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.STRING,
                  label: 'E-Mail',
                  mandatory: true,
                  isArray: false,
                  name: 'eMail',
                  placeholder: '',
                  disabled: true,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.STRING,
                  label: 'Vorname',
                  mandatory: true,
                  isArray: false,
                  name: 'firstName',
                  placeholder: '',
                  disabled: disableForm,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.STRING,
                  label: 'Nachname',
                  mandatory: true,
                  isArray: false,
                  name: 'lastName',
                  placeholder: '',
                  disabled: disableForm,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.DATE,
                  label: 'Geburtstag',
                  mandatory: true,
                  isArray: false,
                  name: 'birthday',
                  placeholder: '',
                  defaultValue: profile.birthday ?? undefined,
                  disabled: disableForm,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.STRING,
                  label: 'Strasse und Hausnummer',
                  mandatory: true,
                  isArray: false,
                  name: 'street',
                  placeholder: '',
                  disabled: disableForm,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.STRING,
                  label: 'PLZ',
                  mandatory: false,
                  isArray: false,
                  name: 'postcode',
                  placeholder: '',
                  disabled: disableForm,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.STRING,
                  label: 'Wohnort',
                  mandatory: false,
                  isArray: false,
                  name: 'city',
                  placeholder: '',
                  disabled: disableForm,
                }}
              />
            </Grid>
            <Grid item>
              <Input
                form={form}
                field={{
                  type: InputType.COUNTRY,
                  label: 'Land',
                  mandatory: false,
                  isArray: false,
                  name: 'country',
                  placeholder: '',
                  disabled: disableForm,
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="reset"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleAbort}
            disabled={disableForm}
            style={{ width: '100%', margin: '5px' }}
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={disableForm}
            style={{ width: '100%', margin: '5px' }}
          >
            Speichern
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
