import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {GameRoom} from "@/components/game-room";
import {RoomSidebar} from "@/components/game/room-sidebar";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Smart Teams Room',
  description: 'Play Smart Teams game online!'
}

interface RoomIdPageProps {
  params: {
    roomId: string
  }
}

const RoomIdPage = async ({params}: RoomIdPageProps) => {
  const room = await db.room.findUnique({
    where: {
      id: params.roomId
    }
  });

  if (!room) return redirect('/');

  return (
    <div className="h-full relative pl-[240px] bg-stone-100">
      <RoomSidebar roomId={room?.id} />
      <GameRoom roomId={room?.id} />
    </div>
  )
}

export default RoomIdPage;
