import {v4 as uuidv4} from 'uuid';
import {db} from "@/lib/db";
import {MemberRole, TeamSide} from '@prisma/client';
import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";


export async function POST(req: Request) {
  try {
    const {title, isPrivate} = await req.json();
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const room = await db.room.create({
      data: {
        title,
        isPrivate,
        inviteCode: uuidv4(),
        creatorId: session.user.id,
        teams: {
          create: [
            {
              name: 'Team TOP',
              side: TeamSide.TOP
            },
            {
              name: 'Team BOTTOM',
              side: TeamSide.BOTTOM
            }
          ]
        },
        members: {
          create: [
            {
              role: MemberRole.MODERATOR,
              userId: session.user.id,
            }
          ]
        }
      }
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("[ROOM POST API_ERROR]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
