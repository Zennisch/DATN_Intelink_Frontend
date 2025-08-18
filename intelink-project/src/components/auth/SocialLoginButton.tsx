import { Button } from "../ui";
import React from "react";
import { ICONS } from "../../types/constants.ts";

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
	const icon = ICONS[provider];

	return (
		<Button
			variant="social"
			fullWidth
			size="lg"
			onClick={onClick}
			loading={loading}
			icon={icon({})}
		>
			{"Sign in with " +
				provider.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
		</Button>
	);
};
