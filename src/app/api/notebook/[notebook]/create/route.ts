import { AuthenticationErrors, NotebookErrors } from "@/const/errors";
import { db } from "@/libs/db";
import { verifyToken } from "@/libs/token";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
	req: NextRequest,
	{
		params,
	}: {
		params: {
			notebook: string;
		};
	}
) => {
	const { notebook } = params;
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

	// Grab the body of the request
	const { name, content, path } = await req.json();

	const createFile = await db.notebookFile.create({
		data: {
			name,
			data: content,
			parent: {
				connect: {
					id: path,
				},
			},
		},
	});

	if (!createFile) {
		return new NextResponse(
			JSON.stringify({
				error: "Failed to create file.",
				transaction: NotebookErrors.GENERIC_ERROR,
			}),
			{
				status: 500,
			}
		);
	}

	return new NextResponse(
		JSON.stringify({
			success: true,
			id: createFile.id,
		})
	);
};
