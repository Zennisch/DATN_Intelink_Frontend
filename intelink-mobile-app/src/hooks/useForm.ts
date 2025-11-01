import { useState, useCallback } from "react";

interface UseFormOptions<T> {
	initialValues: T;
	validate?: (values: T) => Partial<T>;
	onSubmit: (values: T) => Promise<void> | void;
	debounceMs?: number;
}

interface UseFormReturn<T> {
	formData: T;
	errors: Partial<T>;
	isSubmitting: boolean;
	handleInputChange: (field: keyof T) => (value: string) => void;
	handleSubmit: (e?: any) => Promise<void>;
	setFormData: (data: T) => void;
	setErrors: (errors: Partial<T>) => void;
	resetForm: () => void;
}

export const useForm = <T extends Record<string, any>>({
	initialValues,
	validate,
	onSubmit,
	debounceMs = 0,
}: UseFormOptions<T>): UseFormReturn<T> => {
	const [formData, setFormData] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<T>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = useCallback(
		(field: keyof T) => (value: string) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
			
			if (validate) {
				const newErrors = validate({ ...formData, [field]: value });
				setErrors(newErrors);
			}
		},
		[formData, validate]
	);

	const handleSubmit = useCallback(
		async (e?: any) => {
			e?.preventDefault?.();
			
			if (validate) {
				const validationErrors = validate(formData);
				setErrors(validationErrors);
				
				if (Object.keys(validationErrors).length > 0) {
					return;
				}
			}

			setIsSubmitting(true);
			try {
				await onSubmit(formData);
			} catch (error) {
				console.error("Form submission error:", error);
			} finally {
				setIsSubmitting(false);
			}
		},
		[formData, validate, onSubmit]
	);

	const resetForm = useCallback(() => {
		setFormData(initialValues);
		setErrors({});
		setIsSubmitting(false);
	}, [initialValues]);

	return {
		formData,
		errors,
		isSubmitting,
		handleInputChange,
		handleSubmit,
		setFormData,
		setErrors,
		resetForm,
	};
};
