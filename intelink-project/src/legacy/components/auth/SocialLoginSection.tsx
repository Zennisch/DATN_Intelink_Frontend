import React from "react";
import { SocialLoginButton } from "./SocialLoginButton.tsx";

interface SocialLoginSectionProps {
	onGoogleLogin: () => void;
	onGitHubLogin: () => void;
	loading?: boolean;
}

export const SocialLoginSection: React.FC<SocialLoginSectionProps> = ({
	onGoogleLogin,
	onGitHubLogin,
	loading = false,
}) => {
	return (
		<div className="space-y-3">
			<SocialLoginButton
				provider="GOOGLE"
				onClick={onGoogleLogin}
				loading={loading}
			/>
			<SocialLoginButton
				provider="GITHUB"
				onClick={onGitHubLogin}
				loading={loading}
			/>
		</div>
	);
};
