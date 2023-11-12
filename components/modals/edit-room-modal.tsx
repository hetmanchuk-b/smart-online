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
import {Room} from '@prisma/client';


export const EditRoomModal = () => {
  const {isOpen, onClose, type, data} = useModal();
  const {room} = data as {room: Room};

  const isModalOpen = isOpen && type === "editRoom";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Room settings
          </DialogTitle>
        </DialogHeader>
        <GameRoomForm initialData={room} />
      </DialogContent>
    </Dialog>
  )
}
