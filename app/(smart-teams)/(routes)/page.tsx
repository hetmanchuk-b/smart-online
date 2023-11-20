import {GameList} from "@/components/game-list";
import {db} from "@/lib/db";
import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function Home() {
  const rooms = await db.room.findMany({
    where: {
      isPrivate: false
    },
    include: {
      creator: true,
      members: true
    }
  });

  const session = await getAuthSession();

  if (session?.user) {
    const room = await db.room.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    });

    if (room) {
      return redirect(`/room/${room.id}`);
    }
  }

  return (
    <div className="h-full p-2 container">
      <GameList rooms={rooms} />
    </div>
  )
}
