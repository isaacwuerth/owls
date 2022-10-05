import { Action, Subject } from '../../model/Role'

interface AppCapability {
  subject: Subject
  actions: Action[]
}

export const appCapabilities: AppCapability[] = [
  {
    subject: 'all',
    actions: ['manage'],
  },
  {
    subject: 'events',
    actions: ['manage', 'list', 'get', 'create', 'update', 'delete'],
  },
  {
    subject: 'users',
    actions: ['manage', 'list', 'get', 'create', 'update', 'delete'],
  },
  {
    subject: 'eventparticipants',
    actions: ['manage', 'list', 'get', 'create', 'update', 'delete'],
  },
  {
    subject: 'roles',
    actions: ['manage', 'list', 'get', 'create', 'update', 'delete'],
  },
]
