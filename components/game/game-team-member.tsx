import {MemberWithUser} from "@/types/main";
import {UserAvatar} from "@/components/user-avatar";
import {TeamSide} from '@prisma/client';
import {cn} from "@/lib/utils";

interface GameTeamMemberProps {
  member: MemberWithUser;
  side: TeamSide;
}

export const GameTeamMember = ({member, side}: GameTeamMemberProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-y-2 p-2',
        side === TeamSide.TOP ? 'flex-col-reverse' : 'flex-col'
      )}
    >
      <UserAvatar
        user={member?.user}
        className="w-24 h-24"
      />
      <p
        title={member?.user?.username || ''}
        className="text-lg font-semibold tracking-tighter text-center w-auto max-w-[200px] truncate"
      >
        {member?.user?.username}
      </p>

    </div>
  )
}
