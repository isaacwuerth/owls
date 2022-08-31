import EventIcon from '@mui/icons-material/Event'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { ReactElement } from 'react'

export interface NavItem {
  key: string
  name: string
  uri: string
  icon: ReactElement
}

export const NavItems: NavItem[] = [
  { key: 'dashboard', name: 'Übersicht', uri: '/', icon: <DashboardIcon/> },
  { key: 'events', name: 'Events', uri: '/events', icon: <EventIcon/> }
]
