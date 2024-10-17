import { AuthenticationErrors, CryptographyErrors } from "@/const/errors";
import { db } from "@/libs/db";
import { getUserIdFromToken, verifyToken } from "@/libs/token";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	// This endpoint can only be used once per user, and it's used to provision the user's account with keys for encryption.
	// The user must be authenticated to use this endpoint.

	const { publicKey, privateKey, baseKey } = await req.json();
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

	if (!privateKey || !publicKey || !baseKey) {
		return new NextResponse(
			JSON.stringify({
				error: "Fields are missing.",
				transaction: CryptographyErrors.KEYS_MISSING,
			}),
			{
				status: 400,
			}
		);
	}

	const userId = getUserIdFromToken(token);

	// Check if the user already has keys.
	// If they do, return an error.

	const userKeys = await db.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			keyStore: true,
		},
	});

	if (userKeys!!.keyStore.length != 0) {
		return new NextResponse(
			JSON.stringify({
				error: "User already has keys.",
				transaction: CryptographyErrors.KEYS_MISSING,
			}),
			{
				status: 400,
			}
		);
	}

	// If the user doesn't have keys, save the provisioned keys to the database.

	const addKeys = await db.user.update({
		where: {
			id: userId,
		},
		data: {
			keyStore: {
				create: {
					publicKey,
					privateKey,
					key: baseKey,
				},
			},
		},
	});

	if (!addKeys) {
		return new NextResponse(
			JSON.stringify({
				error: "An error occurred while saving the keys.",
				transaction: 0,
			}),
			{
				status: 500,
			}
		);
	}

	return new NextResponse(
		JSON.stringify({
			sucess: "Keys provisioned successfully.",
		}),
		{
			status: 200,
		}
	);
};
