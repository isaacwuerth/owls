import { User } from '@firebase/auth'
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  subject,
} from '@casl/ability'
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createContextualCan } from '@casl/react'
import { useFirebase } from './FirebaseContext'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AccessDenied } from '../pages/app/AccessDenied'
import { requestedRouteAtom } from '../atoms/RequestedRouteAtom'
import { useRecoilState } from 'recoil'
import _ from 'lodash'
import { Action, Actions, Scope, Subject } from '../model/Role'

type Abilities =
  | [Action, 'users']
  | [Action, 'events']
  | [Action, { uid: string }]
type AbilitiesWithScrope = ['users', Action, Scope] | ['events', Action, Scope]
export type AppAbility = MongoAbility<Abilities>

export async function createAbility(user: User) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)
  const idTokenResult = await user.getIdTokenResult(true)
  const { claims } = idTokenResult
  console.log(claims)
  if (!claims.capabilities) throw new Error('No capabilities found')
  const capabilities = claims.capabilities as string[]
  capabilities.forEach((capability) => {
    const [subject, action, scope] = capability.split(
      ':'
    ) as AbilitiesWithScrope
    if (scope === 'all') {
      can(action, subject)
    } else {
      if (!user.uid) throw new Error('No user id found')
      can(action, subject, { uid: { $eq: user.uid } })
    }
  })

  return build()
}

export const AbilityContext = createContext<MongoAbility>(createMongoAbility())

export function FirebaseAuthorizationProvider({ children }: PropsWithChildren) {
  const [ability, setAbility] = useState<AppAbility>(createMongoAbility())

  const {
    apps: { auth },
  } = useFirebase()

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        setAbility(await createAbility(user))

        // userContextRepository.onDocUpdate(user?.uid, async (userContext) => {
        //   if (userContext?.lastPermissionUpdate > lastPermissionUpdate) {
        //     setAbility(await createAbility(user))
        //     setLastPermissionUpdate(userContext.lastPermissionUpdate)
        //     console.log('Permissions updated')
        //   }
        // })
      } else {
        setAbility(createMongoAbility())
      }
    })
  }, [auth.currentUser])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}

export const Can = createContextualCan(AbilityContext.Consumer)

export function useAbility() {
  const abilityContext = useContext(AbilityContext)
  if (abilityContext === undefined) {
    throw new Error(
      'useAbility must be used within a FirebaseAuthorizationProvider'
    )
  }
  return abilityContext
}

interface ProtectedBasisProps {
  action?: Action | Action[]
  subject?: Subject
  scope?: Scope
  this?: object
}

interface ProtectedProps {
  denied?: React.ReactNode
}

export function Protected({
  action,
  subject: subjectToAccess,
  children,
  this: obj,
  denied,
}: PropsWithChildren<ProtectedBasisProps & ProtectedProps>) {
  const ability = useAbility()
  let access = true
  if (!subjectToAccess) return <>{children}</>

  if (action && !Array.isArray(action) && obj)
    access = ability.can(
      action as string,
      subject(subjectToAccess, _.cloneDeep(obj))
    )

  if (!action && !Array.isArray(action) && !obj)
    access = Actions.some((a) => ability.can(a, subjectToAccess))

  if (Array.isArray(action) && !obj)
    access = action.some((a) => ability.can(a, subjectToAccess))

  if (Array.isArray(action) && obj)
    access = action.some((a) =>
      ability.can(a, subject(subjectToAccess, _.cloneDeep(obj)))
    )

  if (!access) return <>{denied}</>

  return <>{children}</>
}

export function ProtectedRoute(props: PropsWithChildren<ProtectedBasisProps>) {
  return <Protected {...props} denied={<AccessDenied />} />
}

export function ProtectedOutlet(props: ProtectedBasisProps) {
  return <Protected {...props} denied={<Outlet />} />
}

export function AuthenticationOutlet() {
  const {
    apps: { auth },
  } = useFirebase()
  const navigate = useNavigate()
  const location = useLocation()
  const [requestedRoute, setRequestedRoute] = useRecoilState(requestedRouteAtom)
  useEffect(() => {
    if (!auth.currentUser) {
      setRequestedRoute(location.pathname)
      navigate('/login')
    } else if (requestedRoute) {
      navigate(requestedRoute)
      setRequestedRoute(null)
    }
  }, [auth.currentUser, requestedRoute])

  return <Outlet />
}
