import {GameList} from "@/components/game-list";
import {db} from "@/lib/db";



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

  return (
    <div className="h-full p-2 container">
      <GameList rooms={rooms} />
    </div>
  )
}
