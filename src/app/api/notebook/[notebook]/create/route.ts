import { NextRequest } from "next/server";

export const POST = async (
	req: NextRequest,
	{
		params,
	}: {
		params: {
			notebook: string;
		};
	}
) => {};
