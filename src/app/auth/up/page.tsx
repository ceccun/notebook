"use client";
import { ArrowRight } from "lucide-react";
import React, { useRef } from "react";
import { KeyGenerator } from "./components/key-generator";

const SignUp = () => {
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<form
			ref={formRef}
			onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				const form = e.currentTarget;
				const formData = new FormData(form);

				let [fullName, email, password, passwordConfirm] = [
					formData.get("fullname") as string,
					formData.get("email") as string,
					formData.get("password") as string,
					formData.get("passwordconfirm") as string,
				];

				fullName = fullName.trim();

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
						accepts: "",
					},
					body: JSON.stringify({
						fullName,
						email,
						password,
					}),
				});

				if (createReq.status == 200) {
					console.log("Wow!");
				}
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

				<KeyGenerator />
			</div>
		</form>
	);
};

export default SignUp;
