import {Icons} from '@/components/icons';
import {cn} from "@/lib/utils";
import {secondaryFont} from "@/lib/fonts";

const CreatedQuizesLoading = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col gap-2">
      <p className={cn('text-2xl font-bold', secondaryFont.className)}>Loading..</p>
      <Icons.spinner className="w-24 h-24 animate-spin" />
    </div>
  )
}

export default CreatedQuizesLoading;
