import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {TeamSide} from '@prisma/client';
import {pusherServer} from "@/lib/pusher";
import {toPusherKey} from "@/lib/utils";

export async function PATCH(
  req: Request,
  {params}: {params: {teamId: string}}
) {
  try {
    const session = await getAuthSession();
    const {name, score} = await req.json();

    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    if (!params.teamId) {
      return new NextResponse('Team ID missing', {status: 400});
    }

    const team = await db.team.update({
      where: {
        id: params.teamId,
      },
      data: {
        name,
        score
      },
      include: {
        teamMembers: {
          include: {
            user: true
          }
        }
      }
    });

    let updateKey: string;

    if (team.side === TeamSide.TOP) {
      updateKey = 'update_top_team';
    } else {
      updateKey = 'update_bottom_team';
    }

    pusherServer.trigger(
      toPusherKey(`room:${team.roomId}:${updateKey}`),
      updateKey,
      team
    );

    return NextResponse.json(team);
  } catch (error) {
    console.log("[EDIT TEAM API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
