"use client"

import {Member, MemberRole} from '@prisma/client';
import {MemberWithUser} from "@/types/main";
import {UserAvatar} from "@/components/user-avatar";
import {ActionTooltip} from "@/components/action-tooltip";
import {roleIconMap} from "@/lib/role-icons";
import {cn} from "@/lib/utils";
import {Icons} from '@/components/icons';
import {useModal} from "@/hooks/use-modal-store";
import {Separator} from "@/components/ui/separator";

interface ChatItemProps {
  id: string;
  content: string;
  member: MemberWithUser;
  timestamp: string;
  deleted: boolean;
  currentMember: Member;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

export const ChatItem = (
  {
    id,
    content,
    member,
    timestamp,
    deleted,
    currentMember,
    socketUrl,
    socketQuery,
  }: ChatItemProps
) => {
  const isMessageOwner = currentMember.id === member.id;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const canDeleteMessage = !deleted && (isMessageOwner || isModerator);
  const {onOpen} = useModal();

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full overflow-hidden">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="hover:drop-shadow-md transition">
          <UserAvatar user={member.user} className="w-6 h-6"/>
        </div>
        <div className="flex flex-col flex-1 items-start">
          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-1">
              <p className="font-semibold text-sm text-stone-600">
                {member.user.username}
              </p>
              <ActionTooltip label={member.role} align={'center'} side={'top'}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <Separator orientation={'vertical'} className="w-1.5 h-1.5 rounded-full bg-stone-500" />
            <div className="text-sm text-stone-500 text-right">
              {timestamp}
            </div>
          </div>
          <p
            className={cn(
              'mt-1 text-stone-800 text-md break-words w-full',
              deleted && 'italic text-stone-500 text-xs mt-1'
            )}
          >
            {content}
          </p>

        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-1 right-5 bg-stone-50 border rounded-sm">
          <ActionTooltip label={'Delete'} side={'left'} align={'center'}>
            <Icons.trash
              onClick={() => onOpen('deleteMessage', {
                apiUrl: `${socketUrl}/${id}`,
                query: socketQuery,
              })}
              className="cursor-pointer w-5 h-5 text-rose-700 hover:text-rose-500 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
