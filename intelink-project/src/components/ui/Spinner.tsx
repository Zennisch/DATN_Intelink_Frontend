interface SpinnerProps {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
	const sizeClasses = {
		sm: 'text-lg',
		md: 'text-2xl',
		lg: 'text-4xl',
		xl: 'text-6xl'
	};

	return (
		<i 
			className={`fa fa-spinner animate-spin ${sizeClasses[size]} ${className}`}
			aria-hidden="true"
		/>
	);
};

export const PageSpinner = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="text-center">
				<Spinner size="xl" className="text-blue-600 mb-4" />
				<p className="text-gray-600 text-lg">Loading...</p>
			</div>
		</div>
	);
};
