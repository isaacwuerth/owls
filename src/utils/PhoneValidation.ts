import libphonenumber from 'google-libphonenumber'
const phoneNumberUtils = libphonenumber.PhoneNumberUtil.getInstance()

export function IsValidPhoneNumber(number: string | undefined): boolean {
    if(!number) return false
    try {
        const phoneNumber = phoneNumberUtils.parseAndKeepRawInput(number)
        return phoneNumberUtils.isValidNumber(phoneNumber)
    } catch (e) {
        return false
    }
}