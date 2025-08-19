export interface IconProps {
	width?: number;
	height?: number;
	className?: string;
}

export const IconComponent = (src: string) => {
	return ({ className, width = 20, height = 20 }: IconProps) => (
		<img
			src={src}
			alt={`Icon`}
			width={width}
			height={height}
			className={className || ""}
		/>
	);
};
