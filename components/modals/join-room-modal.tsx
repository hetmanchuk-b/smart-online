"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-store";
import {JoinRoomForm} from "@/components/join-room-form";


export const JoinRoomModal = () => {
  const {isOpen, onClose, type} = useModal();

  const isModalOpen = isOpen && type === "joinRoom";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Join game by Room ID
          </DialogTitle>
        </DialogHeader>
        <JoinRoomForm />
      </DialogContent>
    </Dialog>
  )
}
