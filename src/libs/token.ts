import { randomBytes } from "crypto"
import { db } from "./db";

export const issueNewToken = async (userID: string, userAgent: string) => {
    const randomElement = randomBytes(64).toString("hex");

    const uniqueElement = JSON.stringify({
        ue: randomElement,
        ua: userAgent,
    });

    const uniqueElementString = Buffer.from(uniqueElement).toString("base64");
    console.log(uniqueElementString)
    const token = `${uniqueElementString}.${userID}`;

    const dbEntry = await db.tokens.create({
        data: {
            token: token,
            User: {
                connect: {
                    id: userID
                }
            }
        }
    });

    return dbEntry.token;
}