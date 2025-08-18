import { Button } from "../ui";
import GoogleIcon from "../../assets/google.svg";
import GitHubIcon from "../../assets/github.svg";
import React from "react";
import {IconComponent} from "../Icon";

const configs = {
	google: {
		icon: IconComponent(GoogleIcon),
		text: "Continue with Google",
	},
	github: {
		icon: IconComponent(GitHubIcon),
		text: "Continue with GitHub",
	},
};

interface SocialLoginButtonProps {
	provider: "google" | "github";
	onClick: () => void;
	loading?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
	provider,
	onClick,
	loading = false,
}) => {
	const config = configs[provider];

	return (
		<Button
			variant="social"
			fullWidth
			size="lg"
			onClick={onClick}
			loading={loading}
			icon={config.icon}
		>
			{config.text}
		</Button>
	);
};

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
				provider="google"
				onClick={onGoogleLogin}
				loading={loading}
			/>
			<SocialLoginButton
				provider="github"
				onClick={onGitHubLogin}
				loading={loading}
			/>
		</div>
	);
};
