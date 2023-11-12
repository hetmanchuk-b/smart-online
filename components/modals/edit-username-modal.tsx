"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-store";
import {EditUsernameForm} from "@/components/forms/edit-username-form";


export const EditUsernameModal = () => {
  const {isOpen, onClose, type, data} = useModal();

  const isModalOpen = isOpen && type === "editUsername";

  const {username} = data as {username: string};

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit your username
          </DialogTitle>
        </DialogHeader>
        <EditUsernameForm currentUsername={username} />
      </DialogContent>
    </Dialog>
  )
}
