import {
	type ChangeEvent,
	forwardRef,
	type InputHTMLAttributes,
	type ReactNode,
	useEffect,
	useId,
	useState,
} from "react";
import { cn } from "./utils.ts"

type Size = "sm" | "md" | "lg"

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked" | "type"> & {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void
  label?: ReactNode
  wrapperClassName?: string
  inputClassName?: string
  switchClassName?: string
  size?: Size
  disabled?: boolean
  labelPosition?: "right" | "left"
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  {
    id,
    checked,
    defaultChecked = false,
    onChange,
    label,
    wrapperClassName,
    inputClassName,
    switchClassName,
    size = "md",
    disabled = false,
    labelPosition = "right",
    name,
    value,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId()
  const finalId = id ?? `toggle-${autoId}`

  const [internalChecked, setInternalChecked] = useState<boolean>(Boolean(defaultChecked))
  const isControlled = checked !== undefined
  const isOn = isControlled ? Boolean(checked) : internalChecked

  useEffect(() => {
    if (isControlled) {
      return
    }
  }, [isControlled])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked
    if (!isControlled) setInternalChecked(next)
    onChange?.(next, e)
  }

  const sizeMap: Record<Size, { track: string; knob: string }> = {
    sm: { track: "h-4 w-8", knob: "h-3 w-3" },
    md: { track: "h-6 w-11", knob: "h-4 w-4" },
    lg: { track: "h-8 w-14", knob: "h-6 w-6" }
  }

  const sizes = sizeMap[size as Size]

  return (
    <div className={cn("inline-flex items-center", wrapperClassName)}>
      {label && labelPosition === "left" && (
        <label htmlFor={finalId} className="mr-3 text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}

      <input
        id={finalId}
        ref={ref}
        type="checkbox"
        name={name}
        value={value}
        className={cn("sr-only", inputClassName)}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        aria-hidden={true}
        {...rest}
      />

      <label
        htmlFor={finalId}
        role="switch"
        aria-checked={isOn}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "relative inline-flex items-center rounded-full cursor-pointer transition-colors",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500",
          sizes.track,
          isOn ? "bg-indigo-600" : "bg-gray-200",
          switchClassName,
          className
        )}
      >
        <span
          className={cn(
            "inline-block transform bg-white rounded-full shadow transition-transform",
            sizes.knob,
            isOn ? "translate-x-full ml-0" : "ml-1",
            size === "sm" ? "-translate-x-0.5" : ""
          )}
        />
      </label>

      {label && labelPosition === "right" && (
        <label htmlFor={finalId} className="ml-3 text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
})
