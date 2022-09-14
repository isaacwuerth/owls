import { atom } from 'recoil'
import { Profile } from '../model/Profil'

const sampleData: Profile = {
  id: '',
  uid: '',
  firstName: 'A',
  lastName: 'A',
  eMail: ''
}

export const profileAtom = atom<Profile>({
  key: 'profileAtom',
  default: sampleData
})
