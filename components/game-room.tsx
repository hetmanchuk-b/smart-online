import {db} from "@/lib/db";
import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {GameTeam} from "@/components/game/game-team";
import {QuizSection} from "@/components/game/quiz-section";
import {LogSection} from "@/components/game/log-section";

interface GameRoomProps {
  roomId: string
}

export const GameRoom = async ({roomId}: GameRoomProps) => {
  const session = await getAuthSession();
  if (!session?.user) return redirect('/');

  const room = await db.room.findUnique({
    where: {
      id: roomId,
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
        }
      }
    }
  });

  if (!room) return redirect('/');

  const member = await db.member.findFirst({
    where: {
      roomId,
      userId: session.user.id
    }
  });

  if (!member) return redirect('/');

  return (
    <div className="h-full grid grid-cols-5">
      <div className="flex flex-col h-full col-start-1 col-end-4">
        <GameTeam
          team={room?.teams[0]}
        />
        <div className="flex-1">
          <QuizSection />
        </div>
        <GameTeam
          team={room?.teams[1]}
        />
      </div>

      <div className="h-full col-start-4 col-end-6 relative">
        <LogSection member={member} room={room} />
      </div>
    </div>
  )
}
