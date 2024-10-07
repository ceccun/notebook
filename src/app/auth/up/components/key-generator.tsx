import React, { useEffect } from "react";
import { generateKey, createMessage, encrypt, readKey } from "openpgp";

export const KeyGenerator = () => {
	const generateBaseKey = () => {
		const values = window.crypto.getRandomValues(new Uint8Array(512));
		let newValues = "";
		values.forEach((value) => {
			newValues += String.fromCharCode(value);
		});
		return newValues;
	};

	useEffect(() => {
		(async () => {
			const baseKey = generateBaseKey();
			// const baseKey = generateRandomString(512);
			let { publicKey, privateKey } = await generateKey({
				type: "ecc",
				curve: "ed25519",
				userIDs: [{ name: "Jon Smith", email: "jon@example.com" }],
				passphrase: "iuguiyfgyuigiuguifg",
				format: "armored",
			});

			publicKey = [
				"Ceccun Account Key. Learn more https://support.ceccun.com/notebook/encryption",
				publicKey,
			].join("\n");
			privateKey = [
				"Ceccun Account Key. Learn more https://support.ceccun.com/notebook/encryption",
				privateKey,
			].join("\n");

			const pubKeyRead = await readKey({ armoredKey: publicKey });

			const baseKeyEncrypted = await encrypt({
				message: await createMessage({ text: baseKey }),
				encryptionKeys: pubKeyRead,
			});

			console.log(baseKeyEncrypted);
		})();
	}, []);
	return (
		<div>
			<h1>Key Generator</h1>
		</div>
	);
};
