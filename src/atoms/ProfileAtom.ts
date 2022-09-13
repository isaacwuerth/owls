import { atom } from 'recoil'
import { ProfilModel } from '../model/ProfilModel'

const sampleData: ProfilModel = {
  id: '',
  uid: '',
  firstName: 'A',
  lastName: 'A',
  eMail: ''
}

export const profileAtom = atom<ProfilModel>({
  key: 'profileAtom',
  default: sampleData
})
