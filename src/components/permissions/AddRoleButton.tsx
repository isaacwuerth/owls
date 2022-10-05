import { ForwardedRef, forwardRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { rolesDefaultState, rolesState } from '../../atoms/RoleCapabilitiesAtom'
import { useFirebase } from '../../Context/FirebaseContext'
import { FormProvider, useForm } from 'react-hook-form'
import { Role, RoleSchema } from '../../model/Role'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { Button, Fab, useMediaQuery, useTheme } from '@mui/material'
import { Popup } from '../../common/Popup'
import Grid2 from '@mui/material/Unstable_Grid2'
import { InputWrapper } from '../DynamicForm/InputWrapper'
import { InputType } from '../DynamicForm/InputType'
import AddIcon from '@mui/icons-material/Add'

function AddRoleButtonInner(props: any, ref: ForwardedRef<HTMLButtonElement>) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [roles, setRoles] = useRecoilState(rolesState)
  const [defaultRoles, setDefaultRoles] = useRecoilState(rolesDefaultState)
  const { roleRepository } = useFirebase()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const methods = useForm<Role>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      capabilities: [],
      description: '',
    },
  })

  function handleClickCreate() {
    setPopupOpen(true)
  }

  function handleClose() {
    setPopupOpen(false)
    methods.reset()
  }

  async function handleSubmit(role: Role) {
    role.id = role.friendlyName.toLowerCase()
    await roleRepository.create(role)
    const createdRole = await roleRepository.findOne(role.id)

    const newDefaultRoles = JSON.parse(JSON.stringify(defaultRoles)) as Role[]
    const newRoles = JSON.parse(JSON.stringify(roles)) as Role[]
    newDefaultRoles.push(createdRole)
    newRoles.push(createdRole)
    setDefaultRoles(newDefaultRoles)
    setRoles(newRoles)
    setPopupOpen(false)
  }

  return (
    <>
      {isDesktop ? (
        <Button
          ref={ref}
          onClick={handleClickCreate}
          variant="outlined"
          startIcon={<AddIcon />}
        >
          Erstellen
        </Button>
      ) : (
        <Fab
          ref={ref}
          color="primary"
          onClick={handleClickCreate}
          aria-label="Erstellen"
        >
          <AddIcon />
        </Fab>
      )}

      <Popup
        title={'Rolle erstellen'}
        open={popupOpen}
        handleClose={handleClose}
        handleSave={methods.handleSubmit(handleSubmit)}
      >
        <FormProvider {...methods}>
          <Grid2 container spacing={3}>
            <Grid2 xs={12}>
              <InputWrapper
                name="friendlyName"
                label="Name"
                type={InputType.STRING}
                mandatory
                placeholder="Name"
              />
            </Grid2>
            <Grid2 xs={12}>
              <InputWrapper
                name={'description'}
                label={'Beschreibung'}
                type={InputType.STRING}
                mandatory={false}
                placeholder={'Beschreibung'}
              />
            </Grid2>
          </Grid2>
        </FormProvider>
      </Popup>
    </>
  )
}

export const AddRoleButton = forwardRef(AddRoleButtonInner)
