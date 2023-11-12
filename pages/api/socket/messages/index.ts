import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types/main";
import {db} from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  try {
    const user = await getServerSession(req, res, authOptions)
      .then((res) => res?.user)

    const {content} = req.body;
    const {roomId} = req.query;

    if (!user) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    if (!roomId || Array.isArray(roomId)) {
      return res.status(400).json({error: 'Room ID Missing'});
    }
    if (!content) {
      return res.status(400).json({error: 'Content Missing'});
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

    const message = await db.message.create({
      data: {
        content,
        roomId,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            user: true
          }
        }
      }
    });

    const roomKey = `chat:${roomId}:messages`;

    res?.socket?.server?.io?.emit(roomKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.log("[SOCKET MESSAGES POST API_ERROR]", error);
    return res.status(500).json({message: 'Internal Error'});
  }
}
