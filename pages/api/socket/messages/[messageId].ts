import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types/main";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {db} from "@/lib/db";
import {MemberRole} from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  try {
    const user = await getServerSession(req, res, authOptions)
      .then((res) => res?.user)

    const {messageId, roomId} = req.query;
    const {content} = req.body;

    if (!user) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    if (!roomId) {
      return res.status(400).json({error: 'Room ID Missing'});
    }
    if (!messageId) {
      return res.status(400).json({error: 'Message ID Missing'});
    }

    const room = await db.room.findFirst({
      where: {
        id: roomId as string,
        members: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        members: true
      }
    });

    if (!room) {
      return res.status(404).json({error: 'Room not found'});
    }

    const member = room.members.find((member) => member.userId === user.id);

    if (!member) {
      return res.status(404).json({error: 'Member not found'});
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId,
        roomId
      },
      include: {
        member: {
          include: {
            user: true,
          }
        }
      }
    });

    if (!message || message.deleted) {
      return res.status(404).json({error: 'Message not found'});
    }

    const isMessageOwner = message.memberId === member.id;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isModerator;

    if (!canModify) {
      return res.status(401).json({error: 'Unauthorized to do this'});
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId,
        },
        data: {
          content: 'This message has been deleted.',
          deleted: true,
        },
        include: {
          member: {
            include: {
              user: true
            }
          }
        }
      });
    }

    const updateKey = `chat:${roomId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE ID_ERROR]", error);
    return res.status(500).json({error: 'Internal Error'});
  }
}