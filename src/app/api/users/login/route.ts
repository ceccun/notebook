import { AuthenticationErrors } from "@/const/errors";
import { db } from "@/libs/db";
import { issueNewToken } from "@/libs/token";
import { compareSync } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const { email, password } = await req.json();

	if (!email || !password) {
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

	// Get the whole database record of the user.

	const user = await db.user.findUnique({
		where: {
			email: email,
		},
		select: {
			id: true,
			email: true,
			password: true,
		},
	});

	if (!user) {
		return new NextResponse(
			JSON.stringify({
				error: "Authentication failure",
				transaction: AuthenticationErrors.AUTHENTICATION_FAILURE,
			})
		);
	}

	const passwordMatch = compareSync(password, user.password);

	if (!passwordMatch) {
		return new NextResponse(
			JSON.stringify({
				error: "Authentication failure",
				transaction: AuthenticationErrors.AUTHENTICATION_FAILURE,
			})
		);
	}

	const newToken = await issueNewToken(
		user.id,
		req.headers.get("user-agent") as string
	);

	return new NextResponse(
		JSON.stringify({
			success: "Token issued successfully",
			token: newToken,
		}),
		{
			status: 200,
		}
	);
};
