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
        'flex flex-col items-center gap-y-2 px-2 py-4',
        side === TeamSide.TOP ? 'flex-col-reverse' : 'flex-col'
      )}
    >
      <UserAvatar
        user={member?.user}
        className="w-28 h-28"
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
