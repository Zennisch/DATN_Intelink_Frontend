import React, { useEffect, useRef, useState } from "react";
import {developmentLog} from "../utils/LogUtil.ts";

export function useForm<T extends Record<keyof T, string>>(
	initialValues: T,
	validateCallback?: (values: T) => Partial<Record<keyof T, string>>,
	submitCallback?: (values: T) => Promise<void>,
	debounceMs: number = 300,
) {
	const [formData, setFormData] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
	const [isValidating, setIsValidating] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Cleanup function to clear the debounce timer on unmount
	// This prevents memory leaks and ensures the timer is cleared when the component using this hook un
	useEffect(() => {
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, []);

	const handleInputChange =
		(field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setFormData((prev) => {
				// Create a new form data object with the updated field
				const newFormData = { ...prev, [field]: value };

				if (debounceMs > 0 && validateCallback) {
					// Clear any existing error for the field being updated for user experience
					setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));

					// Clear the previous debounce timer if it exists
					// This ensures that the validation only runs after the user has stopped typing for the specified delay
					// and prevents multiple validations from being triggered in quick succession
					if (debounceTimer.current) {
						clearTimeout(debounceTimer.current);
					}

					setIsValidating(true);
					developmentLog(`Validating field: ${field.toString()}`);

					// Set a new debounce timer and let it validate after the specified delay
					debounceTimer.current = setTimeout(() => {
						setErrors(validateCallback(newFormData));
						setIsValidating(false);
						developmentLog(`Validation completed for field: ${field.toString()}`);
					}, debounceMs);
				} else if (validateCallback) {
					setErrors(validateCallback(newFormData));
				} else {
					setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
				}

				return newFormData;
			});
		};

	const handleValidate = (): boolean => {
		if (!validateCallback) return true;

		const formErrors: Partial<Record<keyof T, string>> =
			validateCallback(formData);
		setErrors(formErrors);

		return Object.keys(formErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!handleValidate()) return;

		try {
			if (submitCallback) {
				setIsSubmitting(true);
				await submitCallback(formData);
				setIsSubmitting(false);
			}
		} catch (error) {
			setIsSubmitting(false);
			developmentLog(`Form submission failed: ${error}`, "error");
		}
	};

	return {
		formData,
		setFormData,
		errors,
		setErrors,
		isValidating,
		isSubmitting,
		handleInputChange,
		handleValidate,
		handleSubmit,
	};
}
