import {RoomSidebarMenu} from "@/components/game/room-sidebar-menu";
import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SocketIndicator} from "@/components/socket-indicator";
import {RoomMembersList} from "@/components/game/room-members-list";
import {MemberWithUserAndTeam, TeamWithMembersWithUsers} from "@/types/main";
import {RoomTeamsList} from "@/components/game/room-teams-list";

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
          <RoomTeamsList
            roomId={room.id}
            activeTeams={room?.teams as TeamWithMembersWithUsers[]}
          />
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
