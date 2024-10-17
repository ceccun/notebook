import { AuthenticationErrors, NotebookErrors } from "@/const/errors";
import { db } from "@/libs/db";
import { getUserIdFromToken, verifyToken } from "@/libs/token";
import { UserNotebookRelationship } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const { name, keys } = await req.json();
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

	if (!name || !keys) {
		return new NextResponse(
			JSON.stringify({
				error: "Fields are missing.",
				transaction: AuthenticationErrors.FIELDS_MISSING,
			}),
			{
				status: 400,
			}
		);
	}

	const userId = getUserIdFromToken(token);

	const notebook = await db.notebook.create({
		data: {
			name,
			keys: {
				create: {
					privateKey: keys.privateKey,
					publicKey: keys.publicKey,
				},
			},

			rootFolder: {
				create: {
					name: "/", // Root folder
				},
			},
			users: {
				create: {
					User: {
						connect: {
							id: userId,
						},
					},
					relationship: UserNotebookRelationship.OWNER,
				},
			},
		},
	});

	if (!notebook) {
		return new NextResponse(
			JSON.stringify({
				error: "Notebook creation failed.",
				transaction: NotebookErrors.GENERIC_ERROR,
			}),
			{
				status: 500,
			}
		);
	}

	return new NextResponse(
		JSON.stringify({
			success: "Notebook created successfully",
			id: notebook.id,
		}),
		{
			status: 200,
		}
	);
};
