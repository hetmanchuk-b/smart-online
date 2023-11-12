import {ChatInput} from "@/components/chat/chat-input";
import {ChatMessages} from "@/components/chat/chat-messages";
import {Room, Member} from '@prisma/client';

interface LogSectionProps {
  room: Room;
  member: Member;
}

export const LogSection = ({room, member}: LogSectionProps) => {
  return (
    <div className="bg-stone-200 flex flex-col absolute inset-0">
      <ChatMessages
        member={member}
        name={room.title}
        apiUrl={'/api/messages'}
        socketUrl={'/api/socket/messages'}
        roomId={room.id}
      />
      <div className="mt-auto">
        <ChatInput
          apiUrl='/api/socket/messages'
          query={{roomId: room.id}}
        />
      </div>
    </div>
  )
}
