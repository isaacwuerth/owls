import { atom } from 'recoil'
import { SiteConfig } from '../model/SiteConfig'

export const siteConfigAtom = atom<SiteConfig>({
  key: 'siteConfig',
  default: {
    name: '',
    logoUrl: '',
    maintenanceMode: 'off',
    maintenanceMessage: 'Wir sind bald wieder online',
    maintenanceTitle: 'Diese Webseite wird gerade überarbeitet'
  }
})
