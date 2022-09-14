import { DynamicInputText } from './Fields/DynamicInputText'
import { DynamicNumberInput } from './Fields/DynamicNumberInput'
import { DynamicSwitchInput } from './Fields/DynamicSwitchInput'
import { DynamicUnsignedNumberInput } from './Fields/DynamicUnsignedNumberInput'
import { DynamicDateTime } from './Fields/DynamicDateTime'
import { DynamicPhoneNumber } from './Fields/DynamicPhoneNumber'
import { DynamicPassword } from './Fields/DynamicPassword'
import { DynamicDate } from './Fields/DynamicDate'
import { DynamicCountry } from './Fields/DynamicCountry'

export type SupportedPrimitives = number | string | boolean | Date

export enum InputType {
  STRING,
  INTEGER,
  DECIMAL,
  BOOLEAN,
  UNSIGNEDINTEGER,
  DATETIME,
  PHONE,
  PASSWORD,
  DATE,
  COUNTRY
}

export interface DynamicBaseInputProps {
  name: string
  label: string
  value: SupportedPrimitives
  error: boolean
  placeholder: string
  helperText: string
  errorMessage?: string
  onBlur: (event: any) => void
  onChange: (event: any) => void
  fullWidth?: boolean
  width100?: boolean
  disabled?: boolean
}

export function DynamicInput (props: DynamicBaseInputProps & { type: InputType }): JSX.Element {
  switch (props.type) {
    case InputType.STRING:
      return (<DynamicInputText {...props}/>)
    case InputType.INTEGER:
      return (<DynamicNumberInput {...props}/>)
    case InputType.BOOLEAN:
      return (<DynamicSwitchInput {...props}/>)
    case InputType.UNSIGNEDINTEGER:
      return (<DynamicUnsignedNumberInput {...props}/>)
    case InputType.DATETIME:
      return (<DynamicDateTime {...props}/>)
    case InputType.DATE:
      return (<DynamicDate {...props}/>)
    case InputType.PHONE:
      return (<DynamicPhoneNumber {...props}/>)
    case InputType.PASSWORD:
      return (<DynamicPassword {...props}/>)
    case InputType.COUNTRY:
      return (<DynamicCountry {...props}/>)
  }

  return (<div>Unknown input type</div>)
}
