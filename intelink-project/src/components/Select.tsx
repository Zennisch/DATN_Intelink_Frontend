import { ChangeEvent, forwardRef, ReactNode, SelectHTMLAttributes, useId } from "react"
import { cn } from "./utils"

type OptionItem = {
  value: string | number
  label: ReactNode
  disabled?: boolean
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "children"> & {
  id?: string
  options?: OptionItem[]
  children?: ReactNode
  placeholder?: string
  error?: ReactNode
  helpText?: ReactNode
  wrapperClassName?: string
  selectClassName?: string
  fullWidth?: boolean
  onChange?: (value: string, e?: ChangeEvent<HTMLSelectElement>) => void
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id,
    options = [],
    children,
    placeholder,
    error,
    helpText,
    wrapperClassName,
    selectClassName,
    fullWidth = false,
    onChange,
    value,
    defaultValue,
    disabled,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId()
  const finalId = id ?? `select-${autoId}`
  const describedBy: string[] = []
  if (helpText) describedBy.push(`${finalId}-help`)
  if (error) describedBy.push(`${finalId}-error`)

  return (
    <div className={cn(fullWidth ? "w-full" : "", wrapperClassName)}>
      <select
        id={finalId}
        ref={ref}
        className={cn(
          "block w-full px-3 py-2 border rounded-lg text-gray-900 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 transition-all",
          error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300",
          selectClassName,
          className
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy.length ? describedBy.join(" ") : undefined}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e.target.value, e)
        }}
        {...rest}
      >
        {placeholder && !rest.multiple && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.length
          ? options.map((opt) => (
              <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>

      {helpText && (
        <p id={`${finalId}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${finalId}-error`} className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
})
