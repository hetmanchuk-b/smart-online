import {v4 as uuidv4} from 'uuid';
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {MemberRole} from '@prisma/client';

export async function PATCH(
  req: Request,
  {params}: {params: {roomId: string}}
) {
  try {
    if (!params.roomId) {
      return new NextResponse('Room ID missing', {status: 400});
    }

    const room = await db.room.update({
      where: {
        id: params.roomId,
        members: {
          some: {
            role: {
              in: [MemberRole.MODERATOR, MemberRole.PLAYER]
            }
          }
        }
      },
      data: {
        inviteCode: uuidv4()
      }
    });

    return NextResponse.json(room);

  } catch (error) {
    console.log("[INVITE CODE UPDATE_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
