"use client"

import {useState, useEffect} from "react";
import {TeamWithMembersWithUsers} from "@/types/main";
import {TeamSide} from '@prisma/client';
import {cn, toPusherKey} from "@/lib/utils";
import {UserAvatar} from "@/components/user-avatar";
import {pusherClient} from "@/lib/pusher";

interface RoomTeamsListProps {
  roomId: string;
  activeTeams: TeamWithMembersWithUsers[];
}

export const RoomTeamsList = ({roomId, activeTeams}: RoomTeamsListProps) => {
  const [topTeam, setTopTeam] = useState<TeamWithMembersWithUsers>(activeTeams[0]);
  const [bottomTeam, setBottomTeam] = useState<TeamWithMembersWithUsers>(activeTeams[1]);

  const [allTeams, setAllTeams] = useState<TeamWithMembersWithUsers[]>([topTeam, bottomTeam]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`room:${roomId}:update_top_team`));
    pusherClient.subscribe(toPusherKey(`room:${roomId}:update_bottom_team`));

    const updateTopTeamHandler = (newTeam: TeamWithMembersWithUsers) => {
      setTopTeam(newTeam);
    }

    const updateBottomTeamHandler = (newTeam: TeamWithMembersWithUsers) => {
      setBottomTeam(newTeam);
    }

    pusherClient.bind('update_top_team', updateTopTeamHandler);
    pusherClient.bind('update_bottom_team', updateBottomTeamHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`room:${roomId}:update_top_team`));
      pusherClient.unsubscribe(toPusherKey(`room:${roomId}:update_bottom_team`));
      pusherClient.unbind('update_top_team', updateTopTeamHandler);
      pusherClient.unbind('update_bottom_team', updateBottomTeamHandler);
    }
  }, [roomId]);

  useEffect(() => {
    setAllTeams([topTeam, bottomTeam])
  }, [topTeam, bottomTeam]);


  return (
    <div className="flex flex-col items-center gap-y-2">
      {allTeams.map((team) => (
        <div
          key={team.id}
          className="flex flex-col items-center gap-y-1"
        >
          <div
            className={cn(
              'font-bold mb-1 text-center',
              team.side === TeamSide.TOP
                ? 'text-rose-800'
                : 'text-blue-800'
            )}
          >{team.name}</div>
          {team?.teamMembers?.length === 0 && (
            <p className="text-xs uppercase text-stone-400">Empty</p>
          )}
          {team?.teamMembers?.length > 0 && team?.teamMembers?.map((member) => (
            <div
              key={member.id}
              className="font-semibold text-sm flex items-center gap-x-2"
            >
              <UserAvatar user={member?.user} className="w-6 h-6" />
              {member?.user?.username}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
