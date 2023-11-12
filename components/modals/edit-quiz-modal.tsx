"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-store";
import {QuizForm} from "@/components/forms/quiz-form";
import {Quiz} from '@prisma/client';

export const EditQuizModal = () => {
  const {isOpen, onClose, type, data} = useModal();
  const {quiz} = data as {quiz: Quiz};

  const isModalOpen = isOpen && type === "editQuiz";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white px-2 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Quiz Settings
          </DialogTitle>
        </DialogHeader>
        <QuizForm
          initialData={quiz}
        />
      </DialogContent>
    </Dialog>
  )

}
