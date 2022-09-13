import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { ProfilModel } from '../model/ProfilModel'
import { useRecoilState } from 'recoil'
import { profileAtom } from '../atoms/ProfileAtom'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import React from 'react'
import { AvatarUpload } from '../components/Profile/AvatarUpload'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import CountrySelect from '../components/Profile/CountrySelect'

export function ProfilPage () {
  const [profile, setProfileState] = useRecoilState(profileAtom)
  const {
    control,
    handleSubmit,
    reset,
    formState
  } = useForm<ProfilModel>({
    defaultValues: profile
  })

  const onSubmit = (profile: ProfilModel) => {
    setProfileState(profile)
    console.log(profile)
  }

  return (
        <>

            <Card>
                <CardContent>
                    <Typography variant="h2">Profil</Typography>
                    <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction='column' spacing={3}>
                            <Grid item columnSpacing={3}>
                                <AvatarUpload/>
                            </Grid>
                            <Grid item>
                                <Controller
                                    control={control}
                                    name="eMail"
                                    defaultValue={profile.eMail}
                                    rules={{
                                      required: {
                                        value: true,
                                        message: 'This is mandatory'
                                      },
                                      pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: 'Entered value does not match email format'
                                      }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="E-Mail"
                                            type="email"
                                            error={Boolean(formState.errors[field.name])}
                                            helperText={(formState.errors[field.name] != null) ? formState.errors[field.name]?.message : 'Please put a email in'}
                                            {...field}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item>
                                <Controller
                                    control={control}
                                    name="firstName"
                                    defaultValue={profile.firstName}
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
                                    defaultValue={profile.lastName}
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
                                    defaultValue={(profile.birthday != null) ? profile.birthday : null}
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
                                    defaultValue={profile.street}
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
                                    defaultValue={profile.postcode}
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
                                    defaultValue={profile.city}
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
                                    defaultValue={profile.country}
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
                </CardContent>
            </Card>
        </>
  )
}
