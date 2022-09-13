export interface Person {
  id: string
  firstName: string
  lastName: string
  displayName: string
  eMail: string
  avatar?: string
  birthday?: Date | null
  homephone: string
  mobilephone?: string
  street?: string
  postcode?: string
  city?: string
  country?: string
}
