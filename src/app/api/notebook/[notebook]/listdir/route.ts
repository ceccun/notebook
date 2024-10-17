import { AuthenticationErrors, NotebookErrors } from "@/const/errors";
import { db } from "@/libs/db";
import { getUserIdFromToken, verifyToken } from "@/libs/token";
import { NextRequest, NextResponse } from "next/server";

// This route accepts parameters via a header.
export const GET = async (
	req: NextRequest,
	{
		params,
	}: {
		params: {
			notebook: string;
		};
	}
) => {
	const notebookID = params.notebook;
	const token = req.headers.get("authorization");

	if (!token) {
		return new NextResponse(
			JSON.stringify({
				error: "Token is missing.",
				transaction: AuthenticationErrors.TOKEN_MISSING,
			}),
			{
				status: 403,
			}
		);
	}

	// Check if the token is real
	const tokenCheck = await verifyToken(token);

	if (!tokenCheck) {
		return new NextResponse(
			JSON.stringify({
				error: "Token is invalid.",
				transaction: AuthenticationErrors.AUTHENTICATION_FAILURE,
			}),
			{
				status: 403,
			}
		);
	}

	// Get the notebook from the database.
	const notebook = await db.notebook.findUnique({
		where: {
			id: notebookID,
		},
		select: {
			users: true,
			rootFolder: true,
		},
	});

	if (!notebook) {
		return new NextResponse(
			JSON.stringify({
				error: "Notebook not found.",
				transaction: NotebookErrors.NOTEBOOK_NOT_FOUND,
			}),
			{
				status: 404,
			}
		);
	}

	// Check if the user is allowed to access the notebook.
	const user = notebook.users.find(
		(user) => user.userId === getUserIdFromToken(token)
	);

	if (!user) {
		return new NextResponse(
			JSON.stringify({
				error: "User is not allowed to access the notebook.",
				transaction: NotebookErrors.USER_NOT_ALLOWED,
			}),
			{
				status: 403,
			}
		);
	}

	const requestedFolder = req.headers.get("target-folder");

	if (!requestedFolder) {
		return new NextResponse(
			JSON.stringify({
				error: "Folder is missing.",
				transaction: NotebookErrors.FIELDS_MISSING,
			}),
			{
				status: 400,
			}
		);
	}

	// const folderSplit = requestedFolder.split("/");

	// Build DIR structure
	// const folderStructure = folderSplit.reverse();

	// return new NextResponse(JSON.stringify(folderStructure), {
	// 	status: 200,
	// });

	if (requestedFolder === "root") {
		const rootFolder = await db.notebookFolder.findFirst({
			where: {
				notebook: {
					id: notebookID,
				},
				name: "/",
			},
			select: {
				children: {
					select: {
						id: true,
						name: true,
					},
				},
				files: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!rootFolder) {
			return new NextResponse(
				JSON.stringify({
					error:
						"Root folder not found. This typically means your notebook is corrupt.",
					transaction: NotebookErrors.GENERIC_ERROR,
				}),
				{
					status: 404,
				}
			);
		}

		return new NextResponse(JSON.stringify(rootFolder), {
			status: 200,
		});
	}
};
