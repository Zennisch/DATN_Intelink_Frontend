import { Button } from "../ui/Button";
import GoogleIconComponent from "../../assets/google.svg";
import GitHubIconComponent from "../../assets/github.svg";

const getIcon = (iconComponent: string) => {
	return <img src={iconComponent} alt={`${iconComponent} Icon`} width="20" height="20" />;
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
	const configs = {
		google: {
			icon: getIcon(GoogleIconComponent),
			text: "Continue with Google",
		},
		github: {
			icon: getIcon(GitHubIconComponent),
			text: "Continue with GitHub",
		},
	};

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
