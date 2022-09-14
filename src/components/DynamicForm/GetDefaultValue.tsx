import { InputType } from './InputType'

export function getDefaultValue(type: InputType): any {
  if (type === InputType.INTEGER) return 0
  if (type === InputType.DECIMAL) return 0
  if (type === InputType.UNSIGNEDINTEGER) return 0
  if (type === InputType.STRING) return ''
  if (type === InputType.BOOLEAN) return false
  if (type === InputType.DATETIME) return null
  if (type === InputType.DATE) return null
  if (type === InputType.COUNTRY) return ''
}
