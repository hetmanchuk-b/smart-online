import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

interface MemberAvatarProps {
  src?: string;
  className?: string;
}

export const MemberAvatar = ({src, className}: MemberAvatarProps) => {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className || '')}>
      <AvatarImage src={src} />
    </Avatar>
  )
}
