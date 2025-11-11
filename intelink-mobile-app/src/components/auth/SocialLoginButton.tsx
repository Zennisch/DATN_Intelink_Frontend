import React from "react";
import Button from "../atoms/Button";
import { Ionicons } from '@expo/vector-icons';

interface SocialLoginButtonProps {
	provider: "GOOGLE" | "GITHUB";
	onClick: () => void;
	loading?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
	provider,
	onClick,
	loading = false,
}) => {
	const getProviderInfo = () => {
		switch (provider) {
			case "GOOGLE":
				return {
					icon: "logo-google" as const,
					text: "Continue with Google",
					variant: "outline" as const,
				};
			case "GITHUB":
				return {
					icon: "logo-github" as const,
					text: "Continue with GitHub",
					variant: "outline" as const,
				};
			default:
				return {
					icon: "logo-google" as const,
					text: "Continue with Google",
					variant: "outline" as const,
				};
		}
	};

	const { icon, text, variant } = getProviderInfo();

	return (
		<Button
			variant={variant}
			onPress={onClick}
			loading={loading}
			fullWidth
			icon={<Ionicons name={icon} size={20} color="#374151" />}
			iconPosition="left"
		>
			{text}
		</Button>
	);
};
