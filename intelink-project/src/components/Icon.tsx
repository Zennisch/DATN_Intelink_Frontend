import React from "react";

export const IconComponent = (iconSrc: string): React.ReactElement => {
	return (
		<img
			src={iconSrc}
			alt={`${iconSrc} icon`}
			width={20}
			height={20}
		/>
	);
};
