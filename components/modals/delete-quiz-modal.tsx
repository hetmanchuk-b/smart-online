"use client"

import {useState} from "react";
import {useModal} from "@/hooks/use-modal-store";
import axios from "axios";
import {toast} from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Icons} from '@/components/icons';
import {useRouter} from "next/navigation";
import {Quiz} from '@prisma/client';
import {isAxiosError} from "@/lib/utils";

export const DeleteQuizModal = () => {
  const {isOpen, onClose, type, data} = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'deleteQuiz';
  const {quiz} = data as {quiz: Quiz};

  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/quiz/${quiz?.id}`);
      toast.success('Quiz has been deleted.');
      onClose();
      router.refresh();
    } catch (error) {
      console.log("[DELETE QUIZ CLIENT_ERROR]", error);
      if (isAxiosError(error)) {
        toast.error(`Something went wrong: ${error?.response?.data}`);
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Quiz
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br/>
            <span className="font-bold text-stone-700">{quiz?.title}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-stone-100 px-6 py-4">
          <div className="flex items-center justify-between w-full gap-x-2">
            <Button
              className="flex-1"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant={'outline'}
              disabled={isLoading}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
