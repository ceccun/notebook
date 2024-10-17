"use client";
import { AuthenticationErrors, ErrorLayout } from "@/const/errors";
import { ArrowRight } from "lucide-react";
import {
	createMessage,
	decrypt,
	decryptKey,
	encrypt,
	generateKey,
	readKey,
	readMessage,
	readPrivateKey,
} from "openpgp";
import React, { useRef } from "react";

const SignUp = () => {
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<form
			ref={formRef}
			onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				const form = e.currentTarget;
				const formData = new FormData(form);

				let fullName = formData.get("fullname") as string;
				fullName = fullName.trim();

				const [email, password, passwordConfirm] = [
					formData.get("email") as string,
					formData.get("password") as string,
					formData.get("passwordconfirm") as string,
				];

				let valid = true;

				if (fullName.length == 0) {
					valid = false;
				}

				if (password.length < 8) {
					valid = false;
				}

				if (password != passwordConfirm) {
					valid = false;
				}

				const emailRegex =
					/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

				if (!emailRegex.test(email)) {
					valid = false;
				}

				if (!valid) {
					// TODO handle this pls
					return console.log("NOT VALID SORRY");
				}

				const createReq = await fetch("/api/users/create", {
					method: "POST",
					headers: {
						contentType: "application/json",
					},
					body: JSON.stringify({
						fullName,
						email,
						password,
					}),
				});

				if (!createReq.ok) {
					if (createReq.status == 400) {
						const error = (await createReq.json()) as ErrorLayout;

						if (error.transaction == AuthenticationErrors.EMAIL_IN_USE) {
							// TODO handle this pls
							return console.log("EMAIL IN USE");
						}

						if (error.transaction == AuthenticationErrors.FIELDS_MISSING) {
							// TODO handle this pls
							return console.log("FIELDS MISSING");
						}
					}

					return console.log("SOMETHING WENT WRONG");
				}

				// Account has been created successfully, now you need to login

				const loginReq = await fetch("/api/users/login", {
					method: "POST",
					headers: {
						contentType: "application/json",
					},
					body: JSON.stringify({
						email,
						password,
					}),
				});

				if (loginReq.status != 200) {
					// TODO handle this pls
					return console.log("LOGIN FAILED");
				}

				const { token } = await loginReq.json();

				const ls = window.localStorage;

				ls.setItem("token", token);

				// Account keys need to be created now
				// Keys are generated on-device, in the current browser that the user is using and stored forever.

				// First generate the base key, this is the key responsible for encrypting the keys to all the user's notebooks.

				const baseKey = window.crypto.getRandomValues(new Uint8Array(1024));
				let baseKeyBytes = "";

				for (let i = 0; i < baseKey.length; i++) {
					baseKeyBytes += String.fromCharCode(baseKey[i]);
				}

				console.log(baseKeyBytes);

				// Now generate the account key pairs

				const { publicKey, privateKey, revocationCertificate } =
					await generateKey({
						type: "ecc",
						curve: "curve25519",
						userIDs: [
							{
								name: fullName,
								email,
							},
						],
						passphrase: password,
						format: "armored",
					});

				const readPublicKey = await readKey({
					armoredKey: publicKey,
				});

				const encryptedBaseKey = await encrypt({
					message: await createMessage({ text: baseKeyBytes }),
					encryptionKeys: readPublicKey,
				});

				// Store the base key in the local storage
				ls.setItem("bk", btoa(baseKeyBytes));

				// Now send the keys to the database

				const provisionKeys = await fetch("/api/users/keys/provision", {
					method: "POST",
					headers: {
						authorization: token,
						contentType: "application/json",
					},
					body: JSON.stringify({
						publicKey,
						privateKey,
						baseKey: encryptedBaseKey,
					}),
				});

				if (provisionKeys.status != 200) {
					// TODO handle this pls
					return console.log("KEYS PROVISION FAILED");
				}

				// Generate keys for the first notebook.
				const notebookKeys = await generateKey({
					type: "ecc",
					curve: "curve25519",
					userIDs: [
						{
							name: fullName,
							email,
						},
					],
					passphrase: baseKeyBytes,
					format: "armored",
				});

				const notebookPublicKey = notebookKeys.publicKey;
				const notebookPrivateKey = notebookKeys.privateKey;

				const notebookNameFormatted = `${fullName
					.split(" ")[0]
					.trim()}'s Notebook`;

				const createNotebook = await fetch("/api/notebook/create", {
					method: "POST",
					headers: {
						authorization: token,
						contentType: "application/json",
					},
					body: JSON.stringify({
						name: notebookNameFormatted,
						keys: {
							publicKey: notebookPublicKey,
							privateKey: notebookPrivateKey,
						},
					}),
				});
			}}
		>
			<div className="modal">
				<div className="textPair">
					<h3>Create a Notebook account</h3>
					<p>You need to provide details to create your Notebook account.</p>
				</div>

				<input type="text" name="fullname" placeholder="FULL NAME" />
				<input type="email" name="email" placeholder="EMAIL" />

				<p>
					If you forget your password, your Notebooks will be unrecoverable.
				</p>
				<input
					type="password"
					minLength={8}
					name="password"
					placeholder="PASSWORD"
					required
				/>
				<input
					type="password"
					name="passwordconfirm"
					placeholder="CONFIRM PASSWORD"
					required
				/>

				<button type="submit">
					<p>Create</p>
					<ArrowRight size={16} />
				</button>
			</div>
		</form>
	);
};

export default SignUp;
