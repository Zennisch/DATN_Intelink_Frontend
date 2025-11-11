import React from "react";
import { View } from "react-native";
import { SocialLoginButton } from "./SocialLoginButton";

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
		<View className="space-y-3">
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
		</View>
	);
};
