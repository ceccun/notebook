"use client";
import React, { useEffect, useState } from "react";
import { LeftSidebar } from "../components/sidebar";
import { useRouter } from "next/navigation";

declare global {
	interface Window {
		privateKey: string;
		publicKey: string;
		notebookID: string;
	}
}

const Notebook = ({ params }: { params: { notebook: string } }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		window.notebookID = params.notebook;
		const ls = window.localStorage;

		const token = ls.getItem("token");

		if (!token) {
			return router.replace("/auth");
		}

		(async () => {
			const getKeys = await fetch(`/api/notebook/${params.notebook}/keys`, {
				headers: {
					authorization: token,
				},
			});

			if (!getKeys.ok) {
				return;
			}

			const keys = await getKeys.json();

			window.privateKey = keys.privateKey;
			window.publicKey = keys.publicKey;
			setIsLoading(false);
		})();
	}, []);
	return !isLoading && <LeftSidebar id={params.notebook} />;
};

export default Notebook;
