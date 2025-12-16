import { useState, useCallback } from 'react';

interface UseFormProps<T> {
    initialValues: T;
    validate: (values: T) => Partial<T>;
    onSubmit: (values: T) => Promise<void>;
    debounceMs?: number;
}

interface UseFormReturn<T> {
    formData: T;
    errors: Partial<T>;
    handleInputChange: (field: keyof T) => (value: string) => void;
    handleSubmit: () => Promise<void>;
    isSubmitting: boolean;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
}

export const useForm = <T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit,
    debounceMs = 300,
}: UseFormProps<T>): UseFormReturn<T> => {
    const [formData, setFormData] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<T>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback(
        (field: keyof T) => (value: string) => {
            setFormData((prev) => {
                const newValues = { ...prev, [field]: value };
                // Clear error for this field when user types
                if (errors[field]) {
                    setErrors((prevErrors) => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[field];
                        return newErrors;
                    });
                }
                return newValues;
            });
        },
        [errors]
    );

    const handleSubmit = async () => {
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        handleInputChange,
        handleSubmit,
        isSubmitting,
        setFormData,
    };
};
