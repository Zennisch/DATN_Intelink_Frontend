import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react"
import { forwardRef, useId } from "react"
import { cn } from "./utils.ts"

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked" | "type"> & {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void
  label?: ReactNode
  wrapperClassName?: string
  inputClassName?: string
  labelPosition?: "right" | "left"
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    id,
    checked,
    defaultChecked,
    onChange,
    label,
    wrapperClassName,
    inputClassName,
    labelPosition = "right",
    disabled,
    name,
    value,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId()
  const finalId = id ?? `radio-${autoId}`

  return (
    <div className={cn("inline-flex items-center", wrapperClassName)}>
      {label && labelPosition === "left" && (
        <label htmlFor={finalId} className="mr-2 text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}

      <input
        id={finalId}
        ref={ref}
        type="radio"
        name={name}
        value={value}
        className={cn(
          "h-4 w-4 text-gray-600 focus:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-500 border-gray-300",
          inputClassName,
          className
        )}
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
