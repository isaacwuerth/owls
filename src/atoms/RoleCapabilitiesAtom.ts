/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { atom, DefaultValue, selector, selectorFamily } from 'recoil'
import { Capability, Role, Scope } from '../model/Role'
import _ from 'lodash'

export const rolesDefaultState = atom<Role[]>({
  key: 'rolesDefaultState',
  default: [],
})

export const rolesState = atom<Role[]>({
  key: 'rolesState',
  default: [],
})

export const hasRolesChanges = selector<boolean>({
  key: 'hasRolesChanges',
  get: ({ get }) => {
    const modified = get(modifiedRolesState)
    return modified.length > 0
  },
})

type Params = {
  role: string
  subject: string
  action: string
}

function isScopeNone(newValue: string | DefaultValue) {
  return newValue === 'none'
}

export const capabilityState = selectorFamily<Scope, Params>({
  key: 'capabilityState',
  get:
    (param) =>
    ({ get }) => {
      const state = get(rolesState)
      const role = state.find((r) => r.id === param.role)
      const capability = role?.capabilities.find(
        (c) => c.subject === param.subject && c.action === param.action
      )
      return capability?.scope ?? 'none'
    },
  set:
    (param) =>
    ({ set, get }, newValue) => {
      const state = get(rolesState)
      const stateCopy = JSON.parse(JSON.stringify(state))
      const role = stateCopy.find((r: Role) => r.id === param.role)
      const capability = role?.capabilities.find(
        (c: Capability) =>
          c.subject === param.subject && c.action === param.action
      )
      if (isScopeNone(newValue) && !capability) return
      if (isScopeNone(newValue) && capability) {
        role?.capabilities.splice(role.capabilities.indexOf(capability), 1)
      }
      if (capability) {
        capability.scope = newValue as Scope
      } else {
        role?.capabilities.push({
          subject: param.subject,
          action: param.action,
          scope: newValue as Scope,
        })
      }
      set(rolesState, stateCopy)
    },
})

function capabilityCompare(
  capability: Capability,
  modifiedCapability: Capability
): number {
  return (
    capability.subject.localeCompare(modifiedCapability.subject) ||
    capability.action.localeCompare(modifiedCapability.action) ||
    capability.scope.localeCompare(modifiedCapability.scope)
  )
}

function isRoleEqual(a: Role, b: Role) {
  return (
    a.id === b.id &&
    a.friendlyName === b.friendlyName &&
    a.description === b.description &&
    _.isEqual(
      _.cloneDeep(a.capabilities).sort(capabilityCompare),
      _.cloneDeep(b.capabilities).sort(capabilityCompare)
    )
  )
}

export const modifiedRolesState = selector<Role[]>({
  key: 'modifiedRolesState',
  get: ({ get }) => {
    const roles = get(rolesState)
    const defaultRoles = get(rolesDefaultState)
    return roles.filter((r) => {
      const defaultRole = defaultRoles.find((dr) => dr.id === r.id)
      if (!defaultRole) return true
      return !isRoleEqual(r, defaultRole)
    })
  },
})

export const roleNameState = selectorFamily<string, string>({
  key: 'roleNameState',
  get:
    (roleId) =>
    ({ get }) => {
      const roles = get(rolesState)
      const role = roles.find((r) => r.id === roleId)
      return role?.friendlyName ?? ''
    },
  set:
    (roleId) =>
    ({ set, get }, newValue) => {
      const roles = get(rolesState)
      const rolesCopy = JSON.parse(JSON.stringify(roles))
      const role = rolesCopy.find((r: Role) => r.id === roleId)
      role.friendlyName = newValue
      set(rolesState, rolesCopy)
    },
})
