"use client"

import {useState} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {toast} from "sonner";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import qs from "query-string";
import {useModal} from "@/hooks/use-modal-store";
import {Quiz} from '@prisma/client';
import {isAxiosError} from "@/lib/utils";

interface QuizMenuProps {
  quiz: Quiz;
}

export const QuizMenu = ({quiz}: QuizMenuProps) => {
  const {onOpen} = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const onSetPublished = async (value: boolean) => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/quiz/${quiz?.id}/published`,
        query: {
          publish: value
        }
      })
      await axios.patch(url);

      let message: string;
      if (value) {
        message = 'Quiz has been published successfully.';
      } else {
        message = 'Quiz has been unpublished successfully.';
      }
      toast.success(message);
      router.refresh();
    } catch (error) {
      console.log("[PUBLISH QUIZ CLIENT_ERROR]", error);
      if (isAxiosError(error)) {
        toast.error(`Something went wrong: ${error?.response?.data}`);
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const navigateToQuestions = () => {
    router.push(`/new-quiz/${quiz.id}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          {!isLoading
            ? <Icons.horizontalThreeDots className="w-6 h-6" />
            : <Icons.spinner className="w-6 h-6 animate-spin" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className="bg-white">
        {!quiz?.isPublished && (
          <DropdownMenuItem
            onSelect={() => onSetPublished(true)}
            className="cursor-pointer font-medium flex items-center justify-between gap-x-2"
          >
            Make public
            <Icons.folderOpen className="w-4 h-4" />
          </DropdownMenuItem>
        )}
        {quiz?.isPublished && (
          <DropdownMenuItem
            onSelect={() => onSetPublished(false)}
            className="cursor-pointer font-medium flex items-center justify-between gap-x-2"
          >
            Make private
            <Icons.folderLock className="w-4 h-4" />
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={() => onOpen('editQuiz', {quiz})}
          className="cursor-pointer font-medium flex items-center justify-between gap-x-2"
        >
          Edit title and topic
          <Icons.edit className="w-4 h-4" />
        </DropdownMenuItem>

        {pathname && !pathname.includes('/new-quiz') && (
          <DropdownMenuItem
            onSelect={navigateToQuestions}
            className="cursor-pointer font-medium flex items-center justify-between gap-x-2"
          >
            Manage questions
            <Icons.fileQuestion className="w-4 h-4" />
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onOpen('deleteQuiz', {quiz})}
          className="text-rose-700 cursor-pointer font-medium flex items-center justify-between gap-x-2"
        >
          Delete quiz
          <Icons.trash className="w-4 h-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}
