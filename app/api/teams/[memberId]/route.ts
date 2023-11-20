import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {MemberRole, TeamSide} from '@prisma/client';
import {pusherServer} from "@/lib/pusher";
import {toPusherKey} from "@/lib/utils";

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

    const team = await db.team.findUnique({
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

    if (team && team?.teamMembers?.length >= 4) {
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
        teams: {
          include: {
            teamMembers: {
              include: {
                user: true
              }
            }
          },
          orderBy: {
            side: 'asc'
          }
        },
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

    const updatedTeam = room.teams.find((t) => t.side === team.side);
    let updateKey: string;

    if (team.side === TeamSide.TOP) {
      updateKey = 'update_top_team';
    } else {
      updateKey = 'update_bottom_team';
    }

    pusherServer.trigger(
      toPusherKey(`room:${room.id}:${updateKey}`),
      updateKey,
      updatedTeam
    );

    return NextResponse.json(room);
  } catch (error) {
    console.log("[TEAM CHANGE API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
