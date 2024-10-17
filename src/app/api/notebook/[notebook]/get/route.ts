import { AuthenticationErrors } from "@/const/errors";
import { db } from "@/libs/db";
import { getUserIdFromToken, verifyToken } from "@/libs/token";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: { notebook: string } }
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
			id: true,
			name: true,
			users: true,
		},
	});

	if (!notebook) {
		return new NextResponse(
			JSON.stringify({
				error: "Notebook not found.",
				transaction: "NOTEBOOK_NOT_FOUND",
			}),
			{
				status: 404,
			}
		);
	}

	// Check if the user is allowed to access the notebook.
	const userAllowed = notebook.users.find(
		(user) => user.userId === getUserIdFromToken(token)
	);

	if (!userAllowed) {
		return new NextResponse(
			JSON.stringify({
				error: "User is not allowed to access the notebook.",
				transaction: "USER_NOT_ALLOWED",
			}),
			{
				status: 403,
			}
		);
	}

	return new NextResponse(JSON.stringify(notebook), {
		status: 200,
	});
};
