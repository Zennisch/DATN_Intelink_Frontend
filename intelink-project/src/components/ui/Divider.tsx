interface DividerProps {
	text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text = "OR" }) => {
	return (
		<div className="relative">
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t border-gray-300" />
			</div>
			<div className="relative flex justify-center text-sm">
				<span className="px-2 bg-white text-gray-500 font-medium">{text}</span>
			</div>
		</div>
	);
};
