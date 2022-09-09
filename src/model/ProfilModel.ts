export interface ProfilModel {
  id: string
  firstName: string
  lastName: string
  eMail: string
  photoURL?: string
  birthday?: Date | null
  homephone?: string
  mobilephone?: string
  street?: string
  postcode?: string
  city?: string
  country?: string
}
