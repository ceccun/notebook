import React, { useEffect, useState } from "react";
import { File } from "./file";

export const Folder = ({
	path,
	notebookID,
	root = false,
	selectedFolder,
	setSelectedFolder,
	inCreateMode,
	setInCreateMode,
}: {
	path: string;
	notebookID: string;
	root: boolean;
	selectedFolder: string;
	setSelectedFolder: (folder: string) => void;
	inCreateMode: boolean;
	setInCreateMode: (mode: boolean) => void;
}) => {
	const [folders, setFolders] = useState<string[]>([]);
	const [files, setFiles] = useState<string[]>([]);

	useEffect(() => {
		if (root) {
			setSelectedFolder(path);
		}

		const ls = window.localStorage;

		const token = ls.getItem("token");

		if (!token) {
			return;
		}

		(async () => {
			const fetchDirContents = await fetch(
				`/api/notebook/${notebookID}/listdir`,
				{
					headers: {
						Authorization: token,
						"target-folder": path,
					},
				}
			);

			if (!fetchDirContents.ok) {
				console.error("Failed to fetch directory contents.");
				return;
			}

			const dirContents = await fetchDirContents.json();

			setFolders(dirContents.children);
			setFiles(dirContents.files);
		})();
	}, []);

	return (
		<div>
			<File name="test" isEncrypted={false} />
			{inCreateMode && selectedFolder === path && (
				<File
					name=""
					isEncrypted={false}
					create={true}
					setInCreateMode={setInCreateMode}
				/>
			)}
		</div>
	);
};
