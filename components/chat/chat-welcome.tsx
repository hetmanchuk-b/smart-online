import {Icons} from '@/components/icons';

interface ChatWelcomeProps {
  name: string;
}

export const ChatWelcome = ({name}: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      <div className="h-[75px] w-[75px] bg-stone-400 flex items-center justify-center">
        <Icons.brain className="h-12 w-12 text-white" />
      </div>
      <p className="text-xl font-bold text-stone-400">
        Welcome to {name} chat
      </p>
      <p className="text-stone-600 text-sm">
        This is the start of the {name} game.
      </p>
    </div>
  )
}
