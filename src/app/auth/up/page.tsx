"use client";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useRef } from "react";

const SignUp = () => {
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<form
			ref={formRef}
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				console.log("Submit");
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
				/>
				<input
					type="password"
					name="passwordconfirm"
					placeholder="CONFIRM PASSWORD"
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
