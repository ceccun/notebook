import { ChevronDown } from "lucide-react";

export const DropdownHolder = ({ label }: { label: string }) => {
	return (
		<div className="dropdown">
			<span className="oneLine">{label}</span> <ChevronDown size={16} />
		</div>
	);
};
