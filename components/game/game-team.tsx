"use client"

import {useState, useEffect} from "react";
import {TeamWithMembersWithUsers} from "@/types/main";
import {cn, toPusherKey} from "@/lib/utils";
import {TeamSide} from '@prisma/client';
import {GameTeamHeader} from "@/components/game/game-team-header";
import {Separator} from "@/components/ui/separator";
import {GameTeamMember} from "@/components/game/game-team-member";
import {pusherClient} from "@/lib/pusher";

interface GameTeamProps {
  team: TeamWithMembersWithUsers;
  updateKey: string;
  roomId: string;
  side: TeamSide;
}

export const GameTeam = (
  {
    team,
    updateKey,
    roomId,
    side
  }: GameTeamProps
) => {
  const [activeTeam, setActiveTeam] = useState<TeamWithMembersWithUsers>(team);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`room:${roomId}:${updateKey}`));

    const updateTeamHandler = (newTeam: TeamWithMembersWithUsers) => {
      setActiveTeam(newTeam);
    }

    pusherClient.bind(updateKey, updateTeamHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`room:${roomId}:${updateKey}`));
      pusherClient.unbind(updateKey, updateTeamHandler);
    }
  }, [updateKey, roomId]);


  return (
    <div
      className={cn(
        'w-full p-1 border-2',
        activeTeam.side === TeamSide.TOP
          ? 'bg-rose-200/20 border-rose-500'
          : 'bg-blue-200/20 border-blue-500'
      )}
    >
      <div
        className={cn(
          'flex gap-y-0.5',
          activeTeam.side === TeamSide.TOP ? 'flex-col' : 'flex-col-reverse'
        )}
      >
        <GameTeamHeader
          name={activeTeam?.name}
          score={activeTeam?.score}
          side={activeTeam?.side}
        />
        <Separator
          className={cn(activeTeam.side === TeamSide.TOP ? 'bg-rose-500' : 'bg-blue-500')}
        />
        <div className="flex items-center justify-center gap-x-4">
          {activeTeam?.teamMembers?.map((member) => (
            <GameTeamMember
              key={member.id}
              member={member}
              side={activeTeam.side}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
