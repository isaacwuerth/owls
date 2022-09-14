import { DynamicInputFieldProps, InputArray } from './InputArray'
import { SelectArray } from './SelectArray'
import { RadioSelect } from './RadioSelect'
import { Controller } from 'react-hook-form'
import { DynamicInput } from './DynamicInput'

export function Input({ field, form }: DynamicInputFieldProps): JSX.Element {
  if (field.isArray && Array.isArray(field.selectableValues)) {
    return <SelectArray field={field} form={form} />
  } // Array of Checkboxes
  if (!field.isArray && Array.isArray(field.selectableValues)) {
    return <RadioSelect field={field} form={form} />
  } // Radio or Select List
  if (field.isArray && !Array.isArray(field.selectableValues)) {
    return <InputArray field={field} form={form} />
  } // Array List of free Inputs
  if (!field.isArray && !Array.isArray(field.selectableValues)) {
    return (
      <Controller
        control={form.control}
        name={field.name}
        defaultValue={field.defaultValue}
        render={({ field: { name, value, onBlur, onChange } }) => (
          <DynamicInput
            name={name}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            type={field.type}
            helperText={field?.helpMessage ?? ''}
            error={Boolean(form.formState.errors[field.name])}
            errorMessage={form.formState.errors[
              field.name
            ]?.message?.toString()}
            label={`${field.label}${field.mandatory ? ' *' : ''}`}
            placeholder={field.placeholder}
            fullWidth
            disabled={field.disabled}
          />
        )}
      />
    )
  } // Single Input
  return <div>Error</div>
}
