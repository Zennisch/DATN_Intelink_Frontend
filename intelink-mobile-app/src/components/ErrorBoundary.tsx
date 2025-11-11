import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		this.setState({ error, errorInfo });
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: undefined, errorInfo: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<View className="flex-1 items-center justify-center bg-white px-6">
					<View className="items-center">
						<View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
							<Ionicons name="alert-circle" size={32} color="#EF4444" />
						</View>
						
						<Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
							Something went wrong
						</Text>
						
						<Text className="text-gray-600 text-center mb-6 leading-6">
							We&apos;re sorry, but something unexpected happened. 
							Please try again or contact support if the problem persists.
						</Text>

						<TouchableOpacity
							onPress={this.handleRetry}
							className="bg-blue-600 px-6 py-3 rounded-lg flex-row items-center"
						>
							<Ionicons name="refresh" size={20} color="white" />
							<Text className="text-white font-medium ml-2">Try Again</Text>
						</TouchableOpacity>

						{__DEV__ && this.state.error && (
							<View className="mt-6 p-4 bg-gray-100 rounded-lg w-full">
								<Text className="text-sm text-gray-800 font-mono">
									{this.state.error.toString()}
								</Text>
							</View>
						)}
					</View>
				</View>
			);
		}

		return this.props.children;
	}
}
