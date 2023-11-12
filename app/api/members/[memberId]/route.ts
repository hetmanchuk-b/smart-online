import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";

export async function DELETE(
  req: Request,
  {params}: {params: {memberId: string}}
) {
  try {
    const session = await getAuthSession();
    const {searchParams} = new URL(req.url);

    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return new NextResponse('Room ID missing', {status: 400});
    }

    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    if (!params.memberId) {
      return new NextResponse('Member ID missing', {status: 400});
    }

    const room = await db.room.update({
      where: {
        id: roomId,
        creatorId: session.user.id
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            userId: {
              not: session.user.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            user: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("[MEMBER ID DELETE_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}

export async function PATCH(
  req: Request,
  {params}: {params: {memberId: string}}
) {
  try {
    const session = await getAuthSession();
    const {searchParams} = new URL(req.url);
    const {role} = await req.json();

    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const roomId = searchParams.get("roomId");
    if (!roomId) {
      return new NextResponse('Room ID missing', {status: 400});
    }

    if (!params.memberId) {
      return new NextResponse('Member ID missing', {status: 400});
    }

    const room = await db.room.update({
      where: {
        id: roomId,
        creatorId: session.user.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              userId: {
                not: session.user.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("[MEMBERSID PATCH_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
