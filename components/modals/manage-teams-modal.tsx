"use client"

import {useModal} from "@/hooks/use-modal-store";
import qs from 'query-string';
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RoomWithTeamsWithPlayersAndMembersWithUsers
} from "@/types/main";
import {useRouter} from "next/navigation";
import {Button, buttonVariants} from "@/components/ui/button";
import {EditTeamForm} from "@/components/forms/edit-team-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ManageTeamsModal = () => {
  const router = useRouter();
  const {onOpen, isOpen, onClose, type, data} = useModal();

  const isModalOpen = isOpen && type === 'manageTeams';
  const {room} = data as {room: RoomWithTeamsWithPlayersAndMembersWithUsers};

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage teams
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-4 px-6">
          <Accordion
            className="w-full"
            type={'multiple'}
          >
            {room?.teams?.map((team) => (
              <AccordionItem
                key={team.id}
                value={team.id}
              >
                <AccordionTrigger>
                  Edit team {team?.name}
                </AccordionTrigger>
                <AccordionContent>
                  <EditTeamForm
                    teamId={team.id}
                    name={team?.name}
                    score={team?.score}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        </div>
        <DialogFooter className="bg-stone-100 px-6 py-4">
          <div className="flex items-center justify-between w-full gap-x-2">
            <Button
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
