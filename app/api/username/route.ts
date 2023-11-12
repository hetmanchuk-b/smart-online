import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {UsernameValidator} from "@/lib/validators/username";
import {db} from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const body = await req.json();
    const {name} = UsernameValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        username: name
      }
    });

    if (username) {
      return new NextResponse('Username is already taken', {status: 409});
    }

    await db.user.update({
      where: {
        id: session.user.id
      },
      data: {
        username: name
      }
    });

    return new NextResponse('OK');
  } catch (error) {
    console.log("[EDIT USERNAME_ERROR]", error);
    return new NextResponse('Internal error', {status: 500});
  }
}
