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
import qs from "query-string";
import {useRouter} from "next/navigation";

interface QuizAccordionMenuProps {
  quizId: string;
  questionId: string;
}

export const QuizAccordionMenu = ({quizId, questionId}: QuizAccordionMenuProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/quiz/${quizId}/questions`,
        query: {
          questionId
        }
      })
      await axios.delete(url);

      toast.success('Question has been deleted.');
      router.refresh();
    } catch (error) {
      console.log("[DELETE QUESTION CLIENT_ERROR]", error);
      toast.error(`Something went wrong: ${error?.response?.data}`);
    } finally {
      setIsLoading(false)
    }
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
        <DropdownMenuItem
          onSelect={onDelete}
          className="text-rose-700 cursor-pointer font-medium flex items-center gap-x-2"
        >
          Delete question
          <Icons.trash className="w-4 h-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}
