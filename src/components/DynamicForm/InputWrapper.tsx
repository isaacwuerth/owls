import { FieldParameter } from './InputArray'
import { useFormContext } from 'react-hook-form'
import { Input } from './Input'

export function InputWrapper (props: FieldParameter): JSX.Element {
  const form = useFormContext()

  return (
      <Input form={form} field={props}/>
  )
}
