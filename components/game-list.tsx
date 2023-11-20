import {Room, Member, User} from '@prisma/client';
import {GameItem} from "@/components/game-item";
import {RoomWithCreatorAndMembers} from "@/types/main";

interface GameListProps {
  rooms: (Room & {
    members: Member[];
    creator: User | null;
  })[]
}

export const GameList = ({rooms}: GameListProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-wide text-stone-800">Public rooms</h1>
      <div className="space-y-1">
        {rooms.length === 0 ? (
          <div className="text-lg font-semibold tracking-wide text-stone-400">No Smart Teams rooms created yet.</div>
        ) : rooms.map((room) => (
          <GameItem
            room={room as RoomWithCreatorAndMembers}
            key={room.id}
          />
        ))}
      </div>
    </div>
  )
}
