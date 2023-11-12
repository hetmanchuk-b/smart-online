import {create} from "zustand";
import {Room, Quiz} from '@prisma/client';

export type ModalType = 'createRoom'
  | 'invite'
  | 'editRoom'
  | 'joinRoom'
  | 'editUsername'
  | 'members'
  | 'leaveRoom'
  | 'deleteRoom'
  | 'manageTeams'
  | 'editQuiz'
  | 'deleteQuiz'
  | 'deleteMessage';

interface ModalData {
  room?: Room;
  quiz?: Quiz;
  apiUrl?: string;
  query?: Record<string, any>;
  username?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData | null | undefined;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({isOpen: true, type, data}),
  onClose: () => set({type: null, isOpen: false})
}));
