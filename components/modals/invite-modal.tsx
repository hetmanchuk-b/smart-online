"use client"

import {useState} from "react";
import {useModal} from "@/hooks/use-modal-store";
import {useOrigin} from "@/hooks/use-origin";
import axios from "axios";
import {toast} from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Icons} from '@/components/icons';
import {useRouter} from "next/navigation";

export const InviteModal = () => {
  const {onOpen, isOpen, onClose, type, data} = useModal();
  const origin = useOrigin();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'invite';
  const {room} = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite-smart/${room?.inviteCode}`;

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/room/${room?.id}/invite-code`);
      toast.success('New invite link has been generated successfully.');
      onOpen('invite', {room: response.data});
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please, try again later.')
    } finally {
      setIsLoading(false);
    }
  }

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success('Invite link copied')

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Smart players
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-stone-500">
            Room invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              readOnly
              className="bg-stone-200 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button onClick={onCopy}>
              {copied
                ? <Icons.check className="w-4 h-4" />
                : <Icons.copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            className="mt-4 bg-stone-100 gap-x-2"
            size={'sm'}
            variant={'link'}
            onClick={onNew}
          >
            Generate a new link
            {isLoading
              ? <Icons.spinner className="w-4 h-4 animate-spin"/>
              : <Icons.reset className="w-4 h-4"/>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
