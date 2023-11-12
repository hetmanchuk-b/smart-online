"use client"

import {Member, Message, User} from '@prisma/client';
import {ChatWelcome} from "@/components/chat/chat-welcome";
import {useChatQuery} from "@/hooks/use-chat-query";
import {Icons} from '@/components/icons';
import {Fragment, useRef, ElementRef} from "react";
import {ChatItem} from "@/components/chat/chat-item";
import {formatDateToLocal} from "@/lib/utils";
import {useChatSocket} from "@/hooks/use-chat-socket";
import {useChatScroll} from "@/hooks/use-chat-scroll";

interface ChatMessagesProps {
  name: string;
  member: Member;
  apiUrl: string;
  socketUrl: string;
  roomId: string;
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    user: User
  }
}

export const ChatMessages = (
  {
    name,
    member,
    apiUrl,
    socketUrl,
    roomId,
  }: ChatMessagesProps
) => {
  const queryKey = `chat:${roomId}`;
  const addKey = `chat:${roomId}:messages`;
  const updateKey = `chat:${roomId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    queryKey,
    apiUrl,
    roomId,
  });

  useChatSocket({
    queryKey,
    addKey,
    updateKey
  });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Icons.spinner className="animate-spin w-7 h-7 text-stone-500 my-4" />
        <p className="text-xs text-stone-500">
          Loading messages...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Icons.serverCrash className="w-7 h-7 text-stone-500 my-4" />
        <p className="text-xs text-stone-500">
          Something went wrong
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex-1 flex flex-col py-4 overflow-y-auto"
      ref={chatRef}
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Icons.spinner className="animate-spin w-6 h-6 text-stone-500 my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-stone-500 hover:text-stone-700 text-xs my-4"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                member={message.member}
                id={message.id}
                content={message.content}
                deleted={message.deleted}
                timestamp={formatDateToLocal(message.createdAt.toString(), 'en-US', 'short')}
                socketUrl={socketUrl}
                socketQuery={{roomId}}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
