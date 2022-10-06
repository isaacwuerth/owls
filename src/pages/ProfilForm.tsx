import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { updateProfile } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { editUserAtom } from '../atoms/EditUser'
import { profileAtom } from '../atoms/ProfileAtom'
import { Input } from '../components/DynamicForm/Input'
import { InputType } from '../components/DynamicForm/InputType'
import { AvatarUpload } from '../components/Profile/AvatarUpload'
import { useFirebase } from '../Context/FirebaseContext'
import { Profile, ProfileSchema } from '../model/Profil'
import { useAbility } from '../Context/AuthorizationContext'
import { subject } from '@casl/ability'
import _ from 'lodash'

export function ProfileForm() {
  const [user, setUser] = useRecoilState(editUserAtom)
  const setCurrentUser = useSetRecoilState(profileAtom)
  const { usersRepository } = useFirebase()
  const [disableForm, setDisableForm] = useState<boolean>(false)
  const form = useForm<Profile>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: user,
  })
  const ability = useAbility()

  useEffect(() => {
    if (!user?.uid) return
    if (ability.can('update', subject('users', _.cloneDeep(user))))
      setDisableForm(false)
    else setDisableForm(true)
  }, [user])

  const { handleSubmit, reset } = form
  const {
    apps: { auth },
  } = useFirebase()

  const onSubmit = async (newProfile: Profile) => {
    if (!user?.id) return
    setDisableForm(true)
    newProfile = ProfileSchema.parse(newProfile)
    await usersRepository.update(user.id, newProfile)
    setUser(newProfile)

    if (auth.currentUser?.uid === newProfile.uid) {
      setCurrentUser(newProfile)
      await updateProfile(auth.currentUser, {
        displayName: `${newProfile.firstName} ${newProfile.lastName}`,
      })
    }
    toast('Profil wurde aktualisiert', { type: 'success' })
    setDisableForm(false)
  }

  const handleAbort = () => {
    reset(user)
  }

  useEffect(() => {
    reset(user)
  }, [user])

  return (
    <Card>
      <CardContent>
        <Typography variant="h2">Profil</Typography>
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="column" spacing={3}>
            <Grid item columnSpacing={3}>
              <AvatarUpload disabled={disableForm} />
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
                  defaultValue: user?.birthday ?? undefined,
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
