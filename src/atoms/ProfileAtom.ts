import { atom } from 'recoil'
import { ProfilModel } from '../model/ProfilModel'

const sampleData: ProfilModel = {
  id: '1',
  firstName: 'John',
  lastName: 'Dow',
  eMail: 'jowhn@doe.com'
}

export const profileAtom = atom<ProfilModel>({
  key: 'profileAtom',
  default: sampleData
})
