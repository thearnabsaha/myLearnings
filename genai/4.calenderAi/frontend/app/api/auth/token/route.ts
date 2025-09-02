import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return new Response("Unauthorized", { status: 401 });
    return Response.json({ tokenRaw: token }); // token is a decoded payload. If you need a raw string, see note below.
}
