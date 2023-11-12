"use client"

import {Room, Member} from '@prisma/client';
import {GameItem} from "@/components/game-item";

interface GameListProps {
  rooms: (Room & {
    members: Member
  })[]
}

export const GameList = ({rooms}: GameListProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-wide text-stone-800">Public lobby</h1>
      <div className="space-y-1">
        {rooms.length === 0 ? (
          <div className="text-lg font-semibold tracking-wide text-stone-400">No Smart Teams rooms created yet.</div>
        ) : rooms.map((room) => (
          <GameItem
            room={room}
            key={room.id}
          />
        ))}
      </div>
    </div>
  )
}
