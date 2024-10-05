import { ArrowRight } from "lucide-react";
import React from "react";

const SignUp = () => {
	return (
		<div className="modal">
			<div className="textPair">
				<h3>Create a Notebook account</h3>
				<p>You need to provide details to create your Notebook account.</p>
			</div>

			<input type="text" placeholder="FULL NAME" />
			<input type="email" name="emaik" placeholder="EMAIL" />

			<p>If you forget your password, your Notebooks will be unrecoverable.</p>
			<input type="password" name="" placeholder="PASSWORD" />
			<input type="password" name="" placeholder="CONFIRM PASSWORD" />

			<button>
				<p>Create</p>
				<ArrowRight size={16} />
			</button>
		</div>
	);
};

export default SignUp;
