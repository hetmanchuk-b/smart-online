import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {MemberRole} from '@prisma/client';

export async function PATCH(
  req: Request,
  {params}: {params: {memberId: string}}
) {
  try {
    const session = await getAuthSession();
    const {searchParams} = new URL(req.url);

    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const roomId = searchParams.get("roomId");
    const teamId = searchParams.get("teamId");
    if (!roomId) {
      return new NextResponse('Room ID missing', {status: 400});
    }
    if (!teamId) {
      return new NextResponse('Team ID missing', {status: 400});
    }

    if (!params.memberId) {
      return new NextResponse('Member ID missing', {status: 400});
    }

    const teamLength = await db.team.findUnique({
      where: {
        id: teamId,
        room: {
          id: roomId
        }
      },
      include: {
        teamMembers: true
      }
    });

    if (teamLength && teamLength?.teamMembers?.length >= 4) {
      return new NextResponse('Team cannot have more than 4 players.', {status: 401});
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
              },
              role: {
                in: [MemberRole.PLAYER]
              }
            },
            data: {
              teamId
            }
          }
        }
      },
      include: {
        members: {
          include: {
            user: true,
            team: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("[TEAM CHANGE API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
