export const cn = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ")

// Standardized focus styles
export const FOCUS_STYLES = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'

// Standardized transition
export const TRANSITION = 'transition-all duration-200'

// Standardized spacing
export const SPACING = {
  labelLeft: 'mr-3',
  labelRight: 'ml-3',
  labelLeftCompact: 'mr-2',
  labelRightCompact: 'ml-2', 
  helpText: 'mt-1',
  betweenElements: 'space-y-1'
}

// Standardized colors and states
export const COLORS = {
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-700', 
    muted: 'text-gray-500',
    error: 'text-red-600'
  },
  border: {
    default: 'border-gray-300',
    error: 'border-red-500',
    errorFocus: 'focus-visible:ring-red-500'
  },
  background: {
    white: 'bg-white',
    gray: 'bg-gray-200'
  }
}

// Standardized sizes
export const SIZES = {
  text: {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  },
  padding: {
    input: 'px-3 py-3',
    button: {
      sm: 'px-3 py-2',
      md: 'px-4 py-3', 
      lg: 'px-6 py-4'
    }
  },
  borderRadius: 'rounded-lg'
}

// Standardized display modes
export const DISPLAY_MODES = {
  formControl: 'block',
  interactive: 'inline-flex items-center',
  button: 'inline-flex items-center justify-center',
  wrapper: 'flex items-center'
}
