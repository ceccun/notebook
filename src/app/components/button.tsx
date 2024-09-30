import React from "react";

export const Button = ({
	label,
	image,
	displayLabel = false,
	onClick,
}: {
	label: string;
	image: React.ReactNode;
	displayLabel?: boolean;
	onClick?: () => void;
}) => {
	return (
		<button onClick={onClick}>
			{displayLabel && <span>{label}</span>}
			{image}
		</button>
	);
};
