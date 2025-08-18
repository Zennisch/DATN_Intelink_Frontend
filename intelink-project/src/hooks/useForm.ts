import React, { useState } from "react";
import { DEV } from "../types/environment.ts";

export function useForm<T extends Record<keyof T, string>>(
	initialValues: T,
	validateCallback?: (values: T) => Partial<Record<keyof T, string>>,
	submitCallback?: (values: T) => Promise<void>,
) {
	const [formData, setFormData] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange =
		(field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setFormData((prev) => ({
				...prev,
				[field]: value,
			}));

			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			}
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
			if (DEV) {
				console.error("Form submission failed:", error);
			}
		}
	};

	return {
		formData,
		setFormData,
		errors,
		setErrors,
		isSubmitting,
		handleInputChange,
		handleValidate,
		handleSubmit,
	};
}
