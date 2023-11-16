"use client"

import {useState} from "react";
import {Room, Member, User} from '@prisma/client';
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {cn, formatDateToLocal} from "@/lib/utils";
import {secondaryFont} from "@/lib/fonts";
import {ActionTooltip} from "@/components/action-tooltip";
import {Icons} from '@/components/icons';
import {Separator} from "@/components/ui/separator";
import {toast} from "sonner";
import {useOrigin} from "@/hooks/use-origin";
import {RoomWithCreatorAndMembers} from "@/types/main";

interface GameItemProps {
  room: RoomWithCreatorAndMembers
}

export const GameItem = ({room}: GameItemProps) => {
  const router = useRouter();
  const handleJoinRoom = () => {
    router.push(`/invite-smart/${room?.inviteCode}`);
  }
  const origin = useOrigin();

  const inviteUrl = `${origin}/invite-smart/${room?.inviteCode}`;

  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    toast.success('Invite link copied!');
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div
      className="w-full rounded-md flex items-center justify-start gap-2 bg-stone-100 text-stone-700 p-2 hover:bg-stone-200 transition"
    >
      <h3
        className={cn(
          'font-semibold text-lg',
          secondaryFont.className
        )}
      >
        {room.title}
      </h3>
      <Separator orientation={'vertical'} className="h-[26px] bg-stone-400" />
      <ActionTooltip label={'Created by'} side={'bottom'} align={'center'}>
        <p className="font-semibold text-sm">
          {room?.creator?.username}
        </p>
      </ActionTooltip>

      <Separator orientation={'vertical'} className="h-[26px] bg-stone-400" />
      <p className="font-semibold text-sm">Room created: {formatDateToLocal(room?.createdAt.toString())}</p>
      <Separator orientation={'vertical'} className="h-[26px] bg-stone-400" />
      <p className="font-semibold text-sm">
        Members: {room?.members?.length}
      </p>

      <div className="flex items-center gap-x-2 ml-auto">
        <ActionTooltip label={`Join ${room.title}`} side={'top'} align={'end'}>
          <Button
            onClick={handleJoinRoom}
            size={'icon'}
            variant={'outline'}
            className="ml-auto"
          >
            <Icons.planeTakeoff className="w-6 h-6" />
          </Button>
        </ActionTooltip>
        <ActionTooltip label={`Copy Invite Link`} side={'top'} align={'end'}>
          <Button
            onClick={onCopy}
            size={'icon'}
            variant={'outline'}
            className="ml-auto"
          >
            {copied
              ? <Icons.check className="w-6 h-6" />
              : <Icons.copy className="w-6 h-6" />}
          </Button>
        </ActionTooltip>
      </div>

    </div>
  )
}
