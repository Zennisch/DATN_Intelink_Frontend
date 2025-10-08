import { Picker, PickerProps } from '@react-native-picker/picker';
import { forwardRef, ReactNode, useMemo } from 'react';
import { Text, View } from 'react-native';

type PickerInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type PickerInputState = 'default' | 'error' | 'success' | 'disabled';

interface Props extends PickerProps {
    label?: ReactNode;
    error?: ReactNode;
    helpText?: ReactNode;
    size?: PickerInputSize;
    state?: PickerInputState;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    wrapperClassName?: string;
    pickerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    helpTextClassName?: string;
    fullWidth?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    important?: boolean;
    srOnlyLabel?: boolean;
    placeholder?: string;
    items?: Array<{ label: string; value: any }>;
}

interface SizeProps {
    picker: string;
    text: string;
    icon: string;
}

const sizeClasses: Record<PickerInputSize, SizeProps> = {
    xs: {
        picker: 'px-2 py-1 text-xs',
        text: 'text-xs',
        icon: 'w-2 h-2',
    },
    sm: {
        picker: 'px-3 py-1.5 text-sm',
        text: 'text-sm',
        icon: 'w-3 h-3',
    },
    md: {
        picker: 'px-4 py-2 text-base',
        text: 'text-sm',
        icon: 'w-4 h-4',
    },
    lg: {
        picker: 'px-5 py-2.5 text-lg',
        text: 'text-base',
        icon: 'w-5 h-5',
    },
    xl: {
        picker: 'px-6 py-3 text-xl',
        text: 'text-lg',
        icon: 'w-6 h-6',
    },
};

const stateClasses = {
    default: 'border-gray-500 bg-white',
    error: 'border-red-500 bg-white',
    success: 'border-green-500 bg-white',
    disabled: 'border-gray-200 bg-gray-100',
};

const PickerInput = forwardRef<Picker<any>, Props>(
    (
        {
            label,
            error,
            helpText,
            size = 'md',
            state = 'default',
            leftIcon,
            rightIcon,
            wrapperClassName = '',
            pickerClassName = '',
            labelClassName = '',
            errorClassName = '',
            helpTextClassName = '',
            fullWidth = false,
            disabled = false,
            borderless = false,
            important = false,
            srOnlyLabel = false,
            placeholder,
            items = [],
            children,
            ...props
        },
        ref
    ) => {
        const currentState: PickerInputState = useMemo(() => {
            if (disabled) return 'disabled';
            if (error) return 'error';
            return state;
        }, [disabled, error, state]);

        const containerClasses = useMemo(() => {
            if (borderless)
                return `flex flex-row items-center 
                    ${fullWidth ? 'w-full' : ''}`;
            else
                return `flex flex-row items-center 
                    border rounded-lg 
                    ${stateClasses[currentState]} 
                    ${fullWidth ? 'w-full' : ''}`;
        }, [borderless, currentState, fullWidth]);

        const pickerClasses = useMemo(() => {
            return `
                flex-1
                ${pickerClassName}`;
        }, [pickerClassName]);

        return (
            <View className={`${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
                {label && (
                    <View className={`flex-row items-center px-1 ${srOnlyLabel ? 'sr-only' : ''}`}>
                        {typeof label === 'string' ? (
                            <Text className={`${sizeClasses[size].text} text-gray-700 ${labelClassName}`}>{label}</Text>
                        ) : (
                            <View className={labelClassName}>{label}</View>
                        )}
                        {important && <Text className="text-red-500 ml-1">*</Text>}
                    </View>
                )}

                <View className={`${containerClasses}`}>
                    {leftIcon && (
                        <View className={`justify-center items-center ml-2 ${sizeClasses[size].icon}`}>{leftIcon}</View>
                    )}

                    <Picker 
                        ref={ref} 
                        style={{ flex: 1 }}
                        // enabled={!disabled}
                        {...props}
                    >
                        {placeholder && (
                            <Picker.Item 
                                label={placeholder} 
                                value={undefined} 
                            />
                        )}
                        {items.map((item, index) => (
                            <Picker.Item 
                                key={index} 
                                label={item.label} 
                                value={item.value} 
                            />
                        ))}
                        {children}
                    </Picker>

                    {rightIcon && (
                        <View className={`justify-center items-center mr-2 ${sizeClasses[size].icon}`}>{rightIcon}</View>
                    )}
                </View>

                {helpText &&
                    !error &&
                    (typeof helpText === 'string' ? (
                        <Text className={`p-1 text-sm text-gray-500 ${helpTextClassName}`}>{helpText}</Text>
                    ) : (
                        <View className={`p-1 text-sm ${helpTextClassName}`}>{helpText}</View>
                    ))}

                {error &&
                    (typeof error === 'string' ? (
                        <Text className={`p-1 text-sm text-red-600 ${errorClassName}`}>{error}</Text>
                    ) : (
                        <View className={`p-1 text-sm ${errorClassName}`}>{error}</View>
                    ))}
            </View>
        );
    }
);

PickerInput.displayName = 'PickerInput';

export default PickerInput;