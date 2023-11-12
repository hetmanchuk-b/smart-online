import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";

export async function PATCH(
  req: Request,
  {params}: {params: {roomId: string}}
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    if (!params.roomId) {
      return new NextResponse('Room ID Missing', {status: 400});
    }

    const room = await db.room.update({
      where: {
        id: params.roomId,
        creatorId: {
          not: session.user.id
        },
        members: {
          some: {
            userId: session.user.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            userId: session.user.id
          }
        }
      }
    });

    return NextResponse.json(room);

  } catch (error) {
    console.log("[LEAVE ROOM API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
