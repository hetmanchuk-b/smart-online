import {MemberWithUser, TeamWithMembersWithUsers} from "@/types/main";
import {cn} from "@/lib/utils";
import {TeamSide} from '@prisma/client';
import {font, secondaryFont} from "@/lib/fonts";
import {GameTeamHeader} from "@/components/game/game-team-header";
import {Separator} from "@/components/ui/separator";
import {GameTeamMember} from "@/components/game/game-team-member";

interface GameTeamProps {
  team: TeamWithMembersWithUsers;
}

export const GameTeam = ({team}: GameTeamProps) => {
  return (
    <div
      className={cn(
        'w-full p-1.5 border-4',
        team.side === TeamSide.TOP
          ? 'bg-rose-200/20 border-rose-500'
          : 'bg-blue-200/20 border-blue-500'
      )}
    >
      <div
        className={cn(
          'flex gap-y-0.5',
          team.side === TeamSide.TOP ? 'flex-col' : 'flex-col-reverse'
        )}
      >
        <GameTeamHeader
          name={team?.name}
          score={team?.score}
          side={team?.side}
        />
        <Separator
          className={cn(team.side === TeamSide.TOP ? 'bg-rose-500' : 'bg-blue-500')}
        />
        <div className="flex items-center justify-center gap-x-4">
          {team?.teamMembers?.map((member) => (
            <GameTeamMember
              key={member.id}
              member={member}
              side={team.side}
            />
          ))}


        </div>
      </div>

    </div>
  )
}
