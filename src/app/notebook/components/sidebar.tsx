import React, { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { Button } from "@/app/components/button";
import { PenLine, Search } from "lucide-react";
import { DropdownHolder } from "@/app/components/dropdown";
import { Alert } from "./alert";
import { Folder } from "./folder";

export const LeftSidebar = ({ id }: { id: string }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [currentNotebook, setCurrentNotebook] = useState("Ceccun Notebook");
	const [selectedFolder, setSelectedFolder] = useState("");
	const [rootFolderId, setRootFolderId] = useState("");
	const [inCreateMode, setInCreateMode] = useState(false);

	useEffect(() => {
		const ls = window.localStorage;
		const token = ls.getItem("token");

		if (!token) {
			return;
		}

		(async () => {
			const getInformation = await fetch(`/api/notebook/${id}/get`, {
				headers: {
					authorization: token,
				},
			});

			if (!getInformation.ok) {
				return;
			}

			const { name, rootFolder } = await getInformation.json();

			const { id: string } = rootFolder[0];

			setCurrentNotebook(name);
			setRootFolderId(string);
			setIsLoading(false);
		})();
	}, []);

	return (
		<section className={styles.sidebar}>
			<div className={styles.header}>
				<DropdownHolder label={currentNotebook} />
				<div className={styles.actionStrip}>
					<Button label="Search" image={<Search size={16} />} />
					<Button
						label="New note"
						image={<PenLine size={16} />}
						onClick={() => {
							setInCreateMode(!inCreateMode);
						}}
					/>
				</div>
			</div>

			<Alert title="Welcome to your Notebook">
				Brainstorm, type, write, collaborate and share your ideas all from your
				Notebook across all your devices.
			</Alert>

			{!isLoading && (
				<Folder
					path={rootFolderId}
					notebookID={id}
					root={true}
					setSelectedFolder={setSelectedFolder}
					selectedFolder={selectedFolder}
					inCreateMode={inCreateMode}
					setInCreateMode={setInCreateMode}
				/>
			)}
		</section>
	);
};
