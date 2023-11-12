import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {getAuthSession} from "@/lib/auth";

export async function DELETE(
  req: Request,
  {params}: {params: {roomId: string}}
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const createdRoom = await db.room.findFirst({
      where: {
        id: params.roomId,
        creatorId: session.user.id
      }
    });

    if (!createdRoom) {
      return new NextResponse('Only host can delete room.', {status: 409})
    }

    const room = await db.room.delete({
      where: {
        id: params.roomId,
        creatorId: session.user.id
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("[ROOM ID DELETE_ERROR]", error);
    return new NextResponse('Internal error', {status: 500});
  }
}

export async function PATCH(
  req: Request,
  {params}: {params: {roomId: string}}
) {
  try {
    const {title, isPrivate} = await req.json();
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const createdRoom = await db.room.findFirst({
      where: {
        id: params.roomId,
        creatorId: session.user.id
      }
    });

    if (!createdRoom) {
      return new NextResponse('Only host can modify room settings.', {status: 409})
    }

    const room = await db.room.update({
      where: {
        id: params.roomId,
        creatorId: session.user.id
      },
      data: {
        title,
        isPrivate
      }
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("[ROOM ID PATCH_ERROR]", error);
    return new NextResponse('Internal error', {status: 500});
  }
}
