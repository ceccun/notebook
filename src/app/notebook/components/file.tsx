import React, { useEffect, useState } from "react";
import styles from "./file.module.css";
import { StickyNoteIcon } from "lucide-react";
import { Loader } from "@/app/components/loader";

export const File = ({
	name,
	isEncrypted,
	create = false,
	setInCreateMode,
}: {
	name: string;
	isEncrypted: boolean;
	create?: boolean;
	setInCreateMode?: (mode: boolean) => void;
}) => {
	const [displayName, setDisplayName] = useState(name);
	const [createMode, setCreateMode] = useState(create);
	const [loading, setLoading] = useState(false);

	const createFile = async (name: string) => {
		setLoading(true);
	};

	return (
		<div className={styles.container}>
			{loading && <Loader />}
			{!loading && <StickyNoteIcon size={16} />}
			{!createMode && <p>{displayName}</p>}
			{createMode && setInCreateMode && (
				<input
					onKeyUp={(e) => {
						if (e.key == "Enter") {
							createFile(e.currentTarget.value);
						}
					}}
					type="text"
					placeholder={"Name your file"}
					className={styles.input}
					autoFocus={true}
				/>
			)}
		</div>
	);
};
