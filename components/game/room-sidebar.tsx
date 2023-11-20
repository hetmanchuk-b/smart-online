import {RoomSidebarMenu} from "@/components/game/room-sidebar-menu";
import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {TeamSide} from '@prisma/client';
import {db} from "@/lib/db";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {roleIconMap} from "@/lib/role-icons";
import {ActionTooltip} from "@/components/action-tooltip";
import {ScrollArea} from "@/components/ui/scroll-area";
import {UserAvatar} from "@/components/user-avatar";
import {SocketIndicator} from "@/components/socket-indicator";
import {RoomMembersList} from "@/components/game/room-members-list";
import {MemberWithUserAndTeam} from "@/types/main";

interface RoomSidebarProps {
  roomId: string;
}

export const RoomSidebar = async ({roomId}: RoomSidebarProps) => {
  const session = await getAuthSession();

  if (!session?.user) return redirect('/');

  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      members: {
        include: {
          user: true,
          team: true,
        },
        orderBy: {
          role: 'asc'
        }
      },
      teams: {
        include: {
          teamMembers: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          side: 'asc'
        }
      }
    }
  });

  if (!room) return redirect('/');

  const role = room.members.find((member) => member.user.id === session.user.id)?.role;

  return (
    <aside className="w-[240px] absolute left-0 inset-y-0 bg-primary-foreground border-r-stone-200 border-r flex flex-col">
      <RoomSidebarMenu room={room} role={role} />
      <Separator className="w-2/3 h-[1px] bg-stone-400 my-2 mx-auto" />
      <div className="flex flex-col items-center gap-y-2">
        <ScrollArea className="h-[420px] pr-4 w-full">
          <div className="flex flex-col items-center gap-y-2">
            {room?.teams?.map((team) => (
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
          <Separator className="w-2/3 h-[1px] bg-stone-400 my-2 mx-auto" />
          <RoomMembersList
            activeMembers={room.members as MemberWithUserAndTeam[]}
            roomId={room.id}
            user={session.user}
          />
        </ScrollArea>
      </div>

      <div className="w-full flex items-center justify-center p-2 mt-auto">
        <SocketIndicator />
      </div>
    </aside>
  )
}
