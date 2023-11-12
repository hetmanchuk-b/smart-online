"use client"

import {useState} from "react";
import {User} from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {UserAvatar} from "@/components/user-avatar";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Icons} from '@/components/icons';
import {ActionTooltip} from "@/components/action-tooltip";
import {signOut} from "next-auth/react";
import {useModal} from "@/hooks/use-modal-store";
import {cn} from "@/lib/utils";

interface UserAccountNavProps {
  user: User;
}

export const UserAccountNav = ({user}: UserAccountNavProps) => {
  const {onOpen} = useModal();
  const [emailIsVisible, setEmailIsVisible] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="w-8 h-8"
          user={user}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className="bg-white">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.username && (
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium w-[160px] truncate" title={user.username || ''}>
                  {user.username}
                </p>
                <ActionTooltip label={'Edit username'} side={'left'} align={'center'}>
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    className="w-8 h-8"
                    onClick={() => onOpen('editUsername', {username: user.username ?? undefined})}
                  >
                    <span className="sr-only">Edit user name</span>
                    <Icons.edit className="w-4 h-4" />
                  </Button>
                </ActionTooltip>
              </div>
            )}
            {user.email && (
              <ActionTooltip label={'Click to see full email'} side={'left'} align={'center'}>
                <p
                  className={cn(
                    'font-medium truncate text-sm text-stone-500',
                    emailIsVisible ? 'w-[200px]' : 'w-[60px]'
                  )}
                  title={emailIsVisible ? user.email : ''}
                >
                  <span
                    onClick={() => setEmailIsVisible((emailIsVisible) => !emailIsVisible)}
                  >
                    {user.email}
                  </span>
                </p>
              </ActionTooltip>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer font-medium">
          <Link href='/' className="flex items-center justify-between gap-2">
            Lobby
            <Icons.brain className="w-4 h-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer font-medium">
          <Link href='/new-quiz' className="flex items-center justify-between gap-2">
            Create quiz
            <Icons.addCircle className="w-4 h-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer font-medium">
          <Link href='/created-quizes' className="flex items-center justify-between gap-2">
            Your quizes
            <Icons.folders className="w-4 h-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer font-medium">
          <Link href='/quizes' className="flex items-center justify-between gap-2">
            Public quizes
            <Icons.fileSearch className="w-4 h-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="cursor-pointer font-medium text-rose-800 hover:text-rose-600"
          onSelect={async (event) => {
            event.preventDefault();
            await signOut({
              callbackUrl: `${window.location.origin}/sign-in`
            });
          }}
        >
          <p className="flex items-center justify-between gap-2">
            Sign Out
            <Icons.logout className="w-4 h-4" />
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
