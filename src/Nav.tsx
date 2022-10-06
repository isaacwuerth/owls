import EventIcon from '@mui/icons-material/Event'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { ReactElement } from 'react'
import PeopleIcon from '@mui/icons-material/People'
import FolderIcon from '@mui/icons-material/Folder'
import SecurityIcon from '@mui/icons-material/Security'
import { Action, Subject } from './model/Role'

export interface NavigationPermission {
  subject: Subject
  action?: Action | Action[]
}

export interface NavItem {
  key: string
  name: string
  uri: string
  icon: ReactElement
  permission?: NavigationPermission
}

export const NavItems: NavItem[] = [
  { key: 'dashboard', name: 'Übersicht', uri: '/', icon: <DashboardIcon /> },
  {
    key: 'events',
    name: 'Events',
    uri: '/events',
    icon: <EventIcon />,
    permission: { subject: 'events' },
  },
  {
    key: 'users',
    name: 'Benutzer',
    uri: '/users',
    icon: <PeopleIcon />,
    permission: { subject: 'users' },
  },
  {
    key: 'files',
    name: 'Dateien',
    uri: '/files',
    icon: <FolderIcon />,
    permission: { subject: 'files' },
  },
  {
    key: 'roles',
    name: 'Rollen',
    uri: '/roles',
    icon: <SecurityIcon />,
    permission: { subject: 'roles' },
  },
]
