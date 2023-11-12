"use client"

import {useEffect, useState} from "react";
import {InitialModal} from "@/components/modals/initial-modal";
import {JoinRoomModal} from "@/components/modals/join-room-modal";
import {EditUsernameModal} from "@/components/modals/edit-username-modal";
import {InviteModal} from "@/components/modals/invite-modal";
import {EditRoomModal} from "@/components/modals/edit-room-modal";
import {MembersModal} from "@/components/modals/members-modal";
import {LeaveRoomModal} from "@/components/modals/leave-room-modal";
import {DeleteRoomModal} from "@/components/modals/delete-room-modal";
import {ManageTeamsModal} from "@/components/modals/manage-teams-modal";
import {EditQuizModal} from "@/components/modals/edit-quiz-modal";
import {DeleteQuizModal} from "@/components/modals/delete-quiz-modal";
import {DeleteMessageModal} from "@/components/modals/delete-message-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <InitialModal />
      <JoinRoomModal />
      <EditUsernameModal />
      <InviteModal />
      <EditRoomModal />
      <MembersModal />
      <LeaveRoomModal />
      <DeleteRoomModal />
      <ManageTeamsModal />
      <EditQuizModal />
      <DeleteQuizModal />
      <DeleteMessageModal />
    </>
  )
}
