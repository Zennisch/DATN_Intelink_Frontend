import { ChangeEvent, forwardRef, InputHTMLAttributes, ReactNode, RefObject, useEffect, useId } from "react"
import { cn } from "./utils"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked"> {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void
  label?: ReactNode
  wrapperClassName?: string
  inputClassName?: string
  indeterminate?: boolean
  labelPosition?: "right" | "left"
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    id,
    checked,
    defaultChecked,
    onChange,
    label,
    wrapperClassName,
    inputClassName,
    indeterminate = false,
    labelPosition = "right",
    disabled,
    name,
    value,
    ...rest
  },
  ref
) {
  const autoId = useId()
  const finalId = id ?? `checkbox-${autoId}`

  useEffect(() => {
    const input = (ref as RefObject<HTMLInputElement>)?.current
    if (input) {
      input.indeterminate = Boolean(indeterminate)
    } else {
      const el = document.getElementById(finalId) as HTMLInputElement | null
      if (el) el.indeterminate = Boolean(indeterminate)
    }
  }, [indeterminate, ref, finalId])

  return (
    <div className={cn("flex items-center", wrapperClassName)}>
      {label && labelPosition === "left" && (
        <label htmlFor={finalId} className="mr-2 text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}

      <input
        id={finalId}
        ref={ref}
        type="checkbox"
        name={name}
        value={value}
        className={cn("h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded", inputClassName)}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e.target.checked, e)
        }}
        {...rest}
      />

      {label && labelPosition === "right" && (
        <label htmlFor={finalId} className="ml-2 text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
})
