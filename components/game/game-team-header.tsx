import {cn} from "@/lib/utils";
import {font, secondaryFont} from "@/lib/fonts";
import {TeamSide} from '@prisma/client';

interface GameTeamHeaderProps {
  name: string;
  score: number;
  side: TeamSide;
}

export const GameTeamHeader = ({name, score, side}: GameTeamHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4">
      <div
        className={cn(
          'text-lg font-semibold',
          side === TeamSide.TOP ? 'text-rose-950' : 'text-blue-950'
        )}
      >
        {name}
      </div>
      <div className={cn('text-lg font-bold', secondaryFont.className)}>
        <span className={cn("text-sm font-medium mr-2", font.className)}>SCORE:</span>
        {score}
      </div>
    </div>
  )
}
