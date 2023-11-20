"use client";

import {useEffect, useState} from "react";
import {MemberWithUserAndTeam} from "@/types/main";
import {cn, toPusherKey} from "@/lib/utils";
import {ActionTooltip} from "@/components/action-tooltip";
import {roleIconMap} from "@/lib/role-icons";
import {User} from "next-auth";
import {pusherClient} from "@/lib/pusher";

interface RoomMembersListProps {
  activeMembers: MemberWithUserAndTeam[];
  roomId: string;
  user: User;
}

export const RoomMembersList = (
  {
    activeMembers,
    roomId,
    user
  }: RoomMembersListProps
) => {
  const [allMembers, setAllMembers] = useState<MemberWithUserAndTeam[]>(activeMembers);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`room:${roomId}:user_join`));
    pusherClient.subscribe(toPusherKey(`room:${roomId}:user_leave`));
    pusherClient.subscribe(toPusherKey(`room:${roomId}:user_kick`));
    pusherClient.subscribe(toPusherKey(`room:${roomId}:user_role`));

    const userJoinHandler = (newMember: MemberWithUserAndTeam) => {
      setAllMembers((prev) => [...prev, newMember])
    }

    const usersUpdateHandler = (newMembers: MemberWithUserAndTeam[]) => {
      setAllMembers(newMembers);
    }

    pusherClient.bind('user_join', userJoinHandler);
    pusherClient.bind('user_leave', usersUpdateHandler);
    pusherClient.bind('user_kick', usersUpdateHandler);
    pusherClient.bind('user_role', usersUpdateHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`room:${roomId}:user_join`));
      pusherClient.unsubscribe(toPusherKey(`room:${roomId}:user_leave`));
      pusherClient.unsubscribe(toPusherKey(`room:${roomId}:user_kick`));
      pusherClient.unsubscribe(toPusherKey(`room:${roomId}:user_role`));
      pusherClient.unbind('user_join', userJoinHandler);
      pusherClient.unbind('user_leave', usersUpdateHandler);
      pusherClient.unbind('user_kick', usersUpdateHandler);
      pusherClient.unbind('user_update', usersUpdateHandler);
    }
  }, [roomId]);

  return (
    <div className="flex flex-wrap gap-2 p-2">
      <p className="text-xs font-bold text-stone-500 uppercase">Members:</p>
      {allMembers?.map((member) => (
        <div
          key={member.id}
          className={cn(
            'font-semibold text-xs flex items-center gap-x-1',
            user.username === member.user.username && 'underline-offset-4 underline'
          )}
        >
          {member.user.username}
          <ActionTooltip
            label={member.role}
            side={'right'}
            align={'center'}
          >
            {roleIconMap[member.role]}
          </ActionTooltip>
        </div>
      ))}
    </div>
  )
}
