import { CryptographyErrors } from "@/const/errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    // This endpoint can only be used once per user, and it's used to provision the user's account with keys for encryption.
    // The user must be authenticated to use this endpoint.

    const { publicKey, privateKey, baseKey } = await req.json();

    if (!privateKey || !publicKey || !baseKey) {
        return new NextResponse(JSON.stringify({
            error: "Fields are missing.",
            transaction: CryptographyErrors.KEYS_MISSING
        }), {
            status: 400
        });
    }
}