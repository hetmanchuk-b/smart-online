import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {Message} from '@prisma/client';
import {db} from "@/lib/db";
import {MESSAGES_BATCH} from "@/lib/const";

export async function GET(
  req: Request
) {
  try {
    const session = await getAuthSession();
    const {searchParams} = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const roomId = searchParams.get('roomId');

    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    if (!roomId) {
      return new NextResponse('Room ID Missing', {status: 400});
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          roomId,
        },
        include: {
          member: {
            include: {
              user: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          roomId
        },
        include: {
          member: {
            include: {
              user: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });

  } catch (error) {
    console.log("[FETCH MESSAGES_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
