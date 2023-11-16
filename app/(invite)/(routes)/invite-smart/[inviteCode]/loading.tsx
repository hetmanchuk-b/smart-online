import {Icons} from '@/components/icons';
import {cn} from "@/lib/utils";
import {secondaryFont} from "@/lib/fonts";

const InviteCodePageLoading = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col gap-2">
      <p className={cn('text-2xl font-bold', secondaryFont.className)}>
        Redirecting you to the room, please wait..
      </p>
      <Icons.spinner className="w-24 h-24 animate-spin" />
    </div>
  )
}

export default InviteCodePageLoading;
