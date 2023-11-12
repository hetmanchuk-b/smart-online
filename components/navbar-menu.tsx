"use client"

import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {useModal} from "@/hooks/use-modal-store";

export const NavbarMenu = () => {
  const {onOpen} = useModal();

  return (
    <>
      <Button
        variant={'secondary'}
        className="bg-stone-700 hover:bg-stone-500 text-slate-50 hover:text-slate-50"
        onClick={() => onOpen('createRoom')}
      >
        Create Game
        <Icons.badgePlus className="w-4 h-4 ml-2" />
      </Button>
    </>
  )
}
