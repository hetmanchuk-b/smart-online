"use client"

import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {useRouter} from "next/navigation";

export const CloseSignModal = () => {
  const router = useRouter();

  return (
    <Button
      aria-label={'close modal'}
      variant={'ghost'}
      className="text-rose-800 w-8 h-8 p-0 rounded-md"
      onClick={() => router.back()}
    >
      <Icons.close className="w-6 h-6" />
    </Button>
  )
}
