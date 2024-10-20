import React, { useEffect, useState } from "react";
import styles from "./file.module.css";
import { StickyNoteIcon } from "lucide-react";
import { Loader } from "@/app/components/loader";
import {
	createMessage,
	decrypt,
	decryptKey,
	encrypt,
	readKey,
	readMessage,
	readPrivateKey,
} from "openpgp";

export const File = ({
	id,
	name,
	isEncrypted,
	create = false,
	setInCreateMode,
	parentFolder,
	siblings,
	setSiblings,
}: {
	id?: string;
	name: string;
	isEncrypted: boolean;
	create?: boolean;
	setInCreateMode?: (mode: boolean) => void;
	parentFolder?: string;
	siblings?: { id: string; name: string }[];
	setSiblings?: (newSibs: { id: string; name: string }[]) => void;
}) => {
	const [displayName, setDisplayName] = useState("");
	const [createMode, setCreateMode] = useState(create);
	const [loading, setLoading] = useState(false);

	const createFile = async (name: string) => {
		const ls = window.localStorage;
		setLoading(true);
		if (!parentFolder) {
			return;
		}

		// Gather notebook keys
		const privateKey = window.privateKey;
		const publicKey = window.publicKey;

		// Gather account key, to unlock notebook keys
		const accountKey = ls.getItem("bk");

		// Read key
		const publicKeyUsable = await readKey({
			armoredKey: publicKey,
		});

		// Encrypt file name
		const nameEncrypted = await encrypt({
			message: await createMessage({ text: name }),
			encryptionKeys: publicKeyUsable,
		});

		// Encrypt empty data
		const dataEncrypted = await encrypt({
			message: await createMessage({ text: "" }),
			encryptionKeys: publicKeyUsable,
		});

		// Send it off
		const token = ls.getItem("token");
		if (!token) return;

		const createFileRequest = await fetch(
			`/api/notebook/${window.notebookID}/create`,
			{
				method: "POST",
				headers: {
					authorization: token,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: nameEncrypted,
					content: dataEncrypted,
					path: parentFolder,
				}),
			}
		);

		if (!createFileRequest.ok) {
			return;
		}

		const { id } = await createFileRequest.json();

		setSiblings!!([...siblings!!, { name: nameEncrypted as string, id }]);
		setInCreateMode!!(false);
	};

	useEffect(() => {
		if (!isEncrypted) {
			return setDisplayName(name);
		}

		const ls = window.localStorage;

		(async () => {
			const token = ls.getItem("token");

			if (!token) {
				return;
			}

			// Gather private key
			const privateKey = window.privateKey;

			// Get account key
			let accountKey = ls.getItem("bk");

			if (!accountKey) return;

			accountKey = atob(accountKey);

			// Read private key
			const privateKeyUsable = await decryptKey({
				privateKey: await readPrivateKey({
					armoredKey: privateKey,
				}),
				passphrase: accountKey,
			});

			// Make message usable
			const message = await readMessage({
				armoredMessage: name,
			});

			// Decrypt name

			const decryptedName = await decrypt({
				message,
				decryptionKeys: privateKeyUsable,
			});

			setDisplayName(decryptedName.data as string);
		})();
	}, []);

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
