import qs from "query-string";
import {useInfiniteQuery} from "@tanstack/react-query";

import {useSocket} from "@/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  roomId: string;
}

export const useChatQuery = ({queryKey, apiUrl, roomId}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({pageParam = undefined}) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        roomId
      }
    }, {skipNull: true});

    const res = await fetch(url);
    return res.json();
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}
