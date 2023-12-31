import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {getAuthSession} from "@/lib/auth";
import {MemberRole} from '@prisma/client';
import {pusherServer} from "@/lib/pusher";
import {toPusherKey} from "@/lib/utils";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  }
}

const InviteCodePage = async ({params}: InviteCodePageProps) => {
  if (!params.inviteCode) return redirect('/');

  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/sign-in');
  }
  const existingRoom = await db.room.findFirst({
    where: {
      inviteCode: params.inviteCode,
    }
  });

  if (!existingRoom) return redirect('/');

  const joinedRoom = await db.room.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          userId: session.user.id
        }
      }
    }
  });

  if (joinedRoom) {
    return redirect(`/room/${joinedRoom?.id}`);
  }

  const room = await db.room.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            role: MemberRole.GUEST,
            userId: session.user.id
          }
        ]
      }
    },
    include: {
      members: {
        include: {
          user: true,
          team: true,
        },
        orderBy: {
          role: 'asc'
        }
      },
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
      }
    }
  });

  if (room) {
    const newRoomMember = room.members.find((member) => member.user.id === session.user.id);
    pusherServer.trigger(
      toPusherKey(`room:${room.id}:user_join`),
      'user_join',
      newRoomMember
    )
    return redirect(`/room/${room?.id}`);
  }

  return null;
}

export default InviteCodePage;
