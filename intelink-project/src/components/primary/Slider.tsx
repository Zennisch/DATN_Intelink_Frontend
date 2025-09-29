import { ChangeEvent, forwardRef, InputHTMLAttributes, ReactNode, useEffect, useId, useState } from "react"
import { cn } from "./utils.ts"

type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> & {
  id?: string
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number, e?: ChangeEvent<HTMLInputElement>) => void
  showValue?: boolean
  valueFormatter?: (v: number) => ReactNode
  wrapperClassName?: string
  inputClassName?: string
  trackClassName?: string
  fullWidth?: boolean
  helpText?: ReactNode
  error?: ReactNode
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    id,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    showValue = false,
    valueFormatter,
    wrapperClassName,
    inputClassName,
    trackClassName,
    fullWidth = false,
    helpText,
    error,
    disabled,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId()
  const finalId = id ?? `slider-${autoId}`

  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<number>(isControlled ? (value as number) : (defaultValue ?? min))

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value as number)
    }
  }, [value, isControlled])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value)
    if (!isControlled) setInternalValue(next)
    onChange?.(next, e)
  }

  const displayedValue = isControlled ? (value as number) : internalValue
  const describedByIds: string[] = []
  if (helpText) describedByIds.push(`${finalId}-help`)
  if (error) describedByIds.push(`${finalId}-error`)

  return (
    <div className={cn(fullWidth ? "w-full" : "", wrapperClassName)}>
      <div className={cn("flex items-center space-x-4", trackClassName)}>
        <input
          id={finalId}
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayedValue}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={displayedValue}
          aria-describedby={describedByIds.length ? describedByIds.join(" ") : undefined}
          disabled={disabled}
          className={cn(
            "h-2 appearance-none rounded-lg bg-gray-200 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500",
            inputClassName,
            className
          )}
          {...rest}
        />

        {showValue && (
          <div className="w-3 text-center text-sm text-gray-700 tabular-nums">
            {valueFormatter ? valueFormatter(displayedValue) : displayedValue}
          </div>
        )}
      </div>

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
