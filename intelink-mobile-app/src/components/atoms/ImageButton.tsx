import { forwardRef, memo } from 'react';
import { Image, ImageSourcePropType, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ImageButtonSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<ImageButtonSize, string> = {
	sm: 'w-8 h-8',
	md: 'w-12 h-12',
	lg: 'w-16 h-16',
};

interface ImageButtonProps extends TouchableOpacityProps {
	imageSource: ImageSourcePropType;
	size?: ImageButtonSize;
	className?: string;
}

const ImageButton = forwardRef<React.ComponentRef<typeof TouchableOpacity>, ImageButtonProps>(
	({imageSource, size = 'md', className = '', ...props}, ref) => {
		return (
			<TouchableOpacity
				ref={ref}
				className={`justify-center items-center rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
				{...props}
			>
				<Image source={imageSource} className="w-full h-full" resizeMode="cover" />
			</TouchableOpacity>
		);
	}
);

ImageButton.displayName = 'ImageButton';

export default memo(ImageButton);
