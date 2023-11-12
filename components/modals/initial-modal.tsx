"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {GameRoomForm} from "@/components/game-room-form";
import {useModal} from "@/hooks/use-modal-store";


export const InitialModal = () => {
  const {isOpen, onClose, type} = useModal();

  const isModalOpen = isOpen && type === "createRoom";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white overflow-hidden">
        <GameRoomForm initialData={null} />
      </DialogContent>
    </Dialog>
  )
}
