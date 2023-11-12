"use client"

import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {useModal} from "@/hooks/use-modal-store";
import {Room, MemberRole} from '@prisma/client';
import {cn} from "@/lib/utils";
import {secondaryFont} from "@/lib/fonts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface RoomSidebarMenuProps {
  room?: Room;
  role?: MemberRole;
}

export const RoomSidebarMenu = ({room, role}: RoomSidebarMenuProps) => {
  const {onOpen} = useModal();
  const isGuest = role === MemberRole.GUEST;
  const isPlayer = role === MemberRole.PLAYER;
  const isModerator = role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none"
        asChild
      >
        <button
          className={cn(
            'w-full text-lg tracking-tight font-semibold px-3 flex items-center h-12 border-stone-200 border-b-2 hover:bg-stone-200 transition',
            secondaryFont.className
          )}
        >
          <span className="w-[195px] truncate">{room.title}</span>
          <Icons.menu className="w-5 h-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-md font-medium w-[240px] text-black space-y-0.5">
        {(isPlayer || isModerator) && (
          <DropdownMenuItem
            className="w-full rounded-none justify-between cursor-pointer"
            onClick={() => onOpen('invite', {room})}
          >
            Invite player
            <Icons.userPlus className="w-4 h-4"/>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <>
            <DropdownMenuItem
              className="w-full rounded-none justify-between cursor-pointer"
              onClick={() => onOpen('members', {room})}
            >
              Manage members
              <Icons.users className="w-4 h-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full rounded-none justify-between text-slate-800 cursor-pointer"
              onClick={() => onOpen('manageTeams', {room})}
            >
              Manage teams
              <Icons.layers className="w-4 h-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full rounded-none justify-between text-slate-700 cursor-pointer"
              onClick={() => onOpen('editRoom', {room})}
            >
              Room settings
              <Icons.settings className="w-4 h-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full rounded-none justify-between text-rose-800 cursor-pointer"
              onClick={() => onOpen('deleteRoom', {room})}
            >
              Delete room
              <Icons.trash className="w-4 h-4" />
            </DropdownMenuItem>
          </>
        )}
        {!isModerator && (
          <DropdownMenuItem
            className="w-full rounded-none justify-between text-rose-800 cursor-pointer"
            onClick={() => onOpen('leaveRoom', {room})}
          >
            Leave room
            <Icons.logout className="w-4 h-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
