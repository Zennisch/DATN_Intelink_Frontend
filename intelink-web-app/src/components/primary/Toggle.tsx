import {
	type ChangeEvent,
	forwardRef,
	type InputHTMLAttributes,
	type ReactNode,
	useEffect,
	useId,
	useState,
} from "react";
import { cn, FOCUS_STYLES, SPACING, COLORS, SIZES, DISPLAY_MODES } from "./utils.ts"

type Size = "sm" | "md" | "lg"
type LabelPosition = "left" | "right"
type Exclude = "onChange" | "checked" | "type" | "size"

const sizeMap: Record<Size, { track: string; knob: string }> = {
  sm: { track: "h-4 w-8", knob: "h-3 w-3" },
  md: { track: "h-6 w-11", knob: "h-4 w-4" },
  lg: { track: "h-8 w-14", knob: "h-6 w-6" }
}

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, Exclude> {
  // Core behavior props
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  
  // Content props
  label?: ReactNode
  
  // Styling props
  size?: Size
  labelPosition?: LabelPosition
  
  // State props
  error?: ReactNode
  helpText?: ReactNode
  
  // Callback props
  onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void
  
  // Styling override props
  wrapperClassName?: string
  inputClassName?: string
  switchClassName?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  {
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
    error,
    helpText,
    ...props
  },
  ref
) {
  const autoId = useId()
  const id = props.id ?? autoId

  const [internalChecked, setInternalChecked] = useState<boolean>(Boolean(defaultChecked))
  const isControlled = checked !== undefined
  const isOn = isControlled ? Boolean(checked) : internalChecked

  const describedByIds: string[] = [];
  if (error) describedByIds.push(`${id}-error`);
  if (helpText) describedByIds.push(`${id}-help`);

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

  const sizes = sizeMap[size]

  const classes = cn("sr-only", inputClassName)
  const switchClasses = cn(
    "relative inline-flex items-center rounded-full cursor-pointer transition-colors",
    disabled
      ? "opacity-50 cursor-not-allowed"
      : FOCUS_STYLES,
    sizes.track,
    isOn ? "bg-indigo-600" : COLORS.background.gray,
    switchClassName,
    className
  )
  const knobClasses = cn(
    "inline-block transform bg-white rounded-full shadow transition-transform",
    sizes.knob,
    isOn ? "translate-x-full ml-0" : "ml-1",
    size === "sm" ? "-translate-x-0.5" : ""
  )

  return (
    <div className={cn('flex flex-col', wrapperClassName)}>
      <div className={DISPLAY_MODES.interactive}>
        {label && labelPosition === "left" && (
          <label htmlFor={id} className={cn(COLORS.text.secondary, SIZES.text.sm, 'cursor-pointer', SPACING.labelLeft)}>
            {label}
          </label>
        )}

        <input
          id={id}
          ref={ref}
          type="checkbox"
          name={name}
          value={value}
          className={classes}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedByIds.length ? describedByIds.join(' ') : undefined}
          onChange={handleChange}
          aria-hidden={true}
          {...props}
        />

        <label
          htmlFor={id}
          role="switch"
          aria-checked={isOn}
          tabIndex={disabled ? -1 : 0}
          className={switchClasses}
        >
          <span
            className={knobClasses}
          />
        </label>

        {label && labelPosition === "right" && (
          <label htmlFor={id} className={cn(COLORS.text.secondary, SIZES.text.sm, 'cursor-pointer', SPACING.labelRight)}>
            {label}
          </label>
        )}
      </div>

      {helpText && (
        <p id={`${id}-help`} className={`${SPACING.helpText} ${SIZES.text.sm} ${COLORS.text.muted}`}>
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className={`${SPACING.helpText} ${SIZES.text.sm} ${COLORS.text.error}`} role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
})
