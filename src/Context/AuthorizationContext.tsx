import { User } from '@firebase/auth'
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability'
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

type CRUD = 'list' | 'get' | 'create' | 'update' | 'delete'
type Subject = 'users' | 'events'
type Scope = 'all' | 'own' | null | undefined
type Abilities = [CRUD, 'users'] | [CRUD, 'events'] | [CRUD, { uid: string }]
type AbilitiesWithScrope = [CRUD, 'users', Scope] | [CRUD, 'events', Scope]
export type AppAbility = MongoAbility<Abilities>

export async function createAbility(user: User) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)
  const idTokenResult = await user.getIdTokenResult(true)
  const { claims } = idTokenResult
  console.log(claims)
  if (!claims.capabilities) throw new Error('No capabilities found')
  const capabilities = claims.capabilities as string[]
  capabilities.forEach((capability) => {
    const [action, subject, scope] = capability.split(
      ':'
    ) as AbilitiesWithScrope
    if (!scope ?? scope === 'all') {
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

interface ProtectedProps {
  action?: CRUD
  subject?: Subject
  scope?: Scope
}

export function ProtectedRoute({
  action,
  subject,
  children,
}: PropsWithChildren<ProtectedProps>) {
  const ability = useAbility()
  if (!action || !subject) return <Outlet />
  if (!ability.can(action, subject)) {
    return <AccessDenied />
  }
  return children
}

export function ProtectedOutlet({ action, subject }: ProtectedProps) {
  const ability = useAbility()
  if (!action || !subject) return <Outlet />
  if (!ability.can(action, subject)) {
    return <AccessDenied />
  }
  return <Outlet />
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
