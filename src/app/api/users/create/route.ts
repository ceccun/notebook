import { AuthenticationErrors } from "@/const/errors";
import { db } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const POST = async (req: NextRequest) => {
    const { fullName, email, password } = await req.json();

    console.log(req.body)

    if (!email || !fullName || !password) {
        return new NextResponse(JSON.stringify({
            error: "Fields are missing.",
            transaction: AuthenticationErrors.FIELDS_MISSING
        }), {
            status: 400
        })
    }

    // Check the email address first.

    const emailCheck = await db.user.findUnique({
        where: {
            email: email
        }
    });

    if (emailCheck != null) {
        return new NextResponse(JSON.stringify({
            error: "Email already in use",
            transaction: AuthenticationErrors.EMAIL_IN_USE
        }), {
            status: 400
        })
    }

    const hash = hashSync(password, 12);

    try {
        const createUser = await db.user.create({
            data: {
                name: fullName,
                email,
                password: hash
            }
        });

        if (!createUser) {
            return new NextResponse(JSON.stringify({
                error: "Error creating user",
            }), {
                status: 500
            })
        }

        return new NextResponse(JSON.stringify({
            success: "User created successfully",
            id: createUser.id
        }), {
            status: 201
        })

    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return new NextResponse(JSON.stringify({
                    error: "Email already in use",
                    transaction: AuthenticationErrors.EMAIL_IN_USE
                }), {
                    status: 400
                })
            }
        }

        return new NextResponse(JSON.stringify({
            error: "Error creating user"
        }), {
            status: 500
        })
    }
}