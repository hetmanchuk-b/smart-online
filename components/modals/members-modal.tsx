"use client"

import {useState} from "react";
import {MemberRole, TeamSide} from '@prisma/client';
import {useModal} from "@/hooks/use-modal-store";
import qs from 'query-string';
import {
  Dialog,
  DialogContent, DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {RoomWithMembersWithProfiles, RoomWithMembersAndTeamsWithProfilesWithTeam} from "@/types/main";
import {ScrollArea} from "@/components/ui/scroll-area";
import {MemberAvatar} from "@/components/game/member-avatar";
import {Icons} from '@/components/icons';
import {ActionTooltip} from "@/components/action-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {roleIconMap} from "@/lib/role-icons";

export const MembersModal = () => {
  const router = useRouter();
  const {onOpen, isOpen, onClose, type, data} = useModal();
  const [loadingId, setLoadingId] = useState<string>('');

  const isModalOpen = isOpen && type === 'members';
  const {room} = data as {room: RoomWithMembersAndTeamsWithProfilesWithTeam};

  const topTeam = room?.teams?.find((team) => team.side === TeamSide.TOP);
  const bottomTeam = room?.teams?.find((team) => team.side === TeamSide.BOTTOM);

  const onTeamChange = async (memberId: string, teamId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/teams/${memberId}`,
        query: {
          roomId: room?.id,
          teamId
        }
      });

      const response = await axios.patch(url);
      router.refresh();
      onClose();
      toast.success('Team changed successfully.');

    } catch (error) {
      console.log("[TEAM CHANGE CLIENT_ERROR]", error);
      toast.error(`Something went wrong: ${error?.response?.data}`);
    } finally {
      setLoadingId('');
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          roomId: room?.id,
        }
      });

      const response = await axios.patch(url, {role});
      router.refresh();
      onClose();
      toast.success('Role changed successfully.');

    } catch (error) {
      console.log("[ROLE CHANGE_ERROR]", error);
      toast.error(`Something went wrong: ${error?.response?.data}`)
    } finally {
      setLoadingId('')
    }
  }

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          roomId: room?.id
        }
      });

      const response = await axios.delete(url);
      onOpen('members', {room: response.data});

    } catch (error) {
      console.log("[KICK MEMBER_ERROR]", error);
      toast.error(`Something went wrong: ${error?.response?.data}`)
    } finally {
      setLoadingId('');
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {room?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          className="mt-8 max-h-[420px] pr-6"
        >
          {room?.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-x-2 mb-4"
            >
              <MemberAvatar src={member.user.image} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-2">
                  {member.user.username}
                  <ActionTooltip
                    label={member.role}
                    side={'bottom'}
                    align={'center'}
                  >
                    {roleIconMap[member.role]}
                  </ActionTooltip>
                </div>
              </div>
              {
                room.creatorId !== member.userId && loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(buttonVariants({variant: 'ghost', size: 'icon'}))}
                      >
                        <Icons.verticalThreeDots className="w-4 h-4 text-stone-900" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side={'left'}>
                        {member.role === MemberRole.PLAYER && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                              className="flex items-center"
                            >
                              <Icons.layers className="w-4 h-4 mr-2" />
                              <span>Move to Team</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className='gap-x-1 font-semibold'
                                  onClick={() => onTeamChange(member.id, topTeam?.id)}
                                >
                                  <Icons.brain className="w-4 h-4 text-rose-500" />
                                  Top
                                  {member?.team?.side === TeamSide.TOP && (
                                    <Icons.check className="w-4 h-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='gap-x-1 font-semibold'
                                  onClick={() => onTeamChange(member.id, bottomTeam?.id)}
                                >
                                  <Icons.brain className="w-4 h-4 text-blue-500" />
                                  Bottom
                                  {member?.team?.side === TeamSide.BOTTOM && (
                                    <Icons.check className="w-4 h-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        )}
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            className="flex items-center"
                          >
                            <Icons.shieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                className='gap-x-1 font-semibold'
                                onClick={() => onRoleChange(member.id, MemberRole.GUEST)}
                              >
                                <Icons.guest className="w-4 h-4 text-stone-500" />
                                Guest
                                {member.role === MemberRole.GUEST && (
                                  <Icons.check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className='gap-x-1 font-semibold'
                                onClick={() => onRoleChange(member.id, MemberRole.PLAYER)}
                              >
                                <Icons.brain className="w-4 h-4 text-stone-500" />
                                Player
                                {member.role === MemberRole.PLAYER && (
                                  <Icons.check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKick(member.id)}
                        >
                          <Icons.gavel className="w-4 h-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              }
              {loadingId === member.id && (
                <Icons.spinner className="w-4 h-4 ml-auto animate-spin" />
              )}

            </div>
          ))}

        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
