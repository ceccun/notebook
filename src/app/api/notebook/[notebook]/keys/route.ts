import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db";
import { getUserIdFromToken, verifyToken } from "@/libs/token";
import { AuthenticationErrors, NotebookErrors } from "@/const/errors";

export const GET = async (
	req: Request,
	params: {
		notebook: string;
	}
) => {
	const { notebook } = params;
	const token = req.headers.get("authorization");

	if (!token) {
		return new NextResponse(
			JSON.stringify({
				error: "Token is missing.",
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

	// Get the user's ID
	const userID = getUserIdFromToken(token);

	// Get the keys from the database

	const keys = await db.notebookKey.findFirst({
		where: {
			Notebook: {
				id: notebook,
				users: {
					some: {
						User: {
							id: userID,
						},
					},
				},
			},
		},
		select: {
			id: true,
			privateKey: true,
			publicKey: true,
		},
	});

	if (!keys) {
		return new NextResponse(
			JSON.stringify({
				error: "Keys not found.",
				transaction: NotebookErrors.GENERIC_ERROR,
			}),
			{
				status: 404,
			}
		);
	}

	return new NextResponse(JSON.stringify(keys));
};
