import { useContext } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET all messages in an app
export default function useMessages(id: number | null, options: any) {
    const PAGE_SIZE = 25;
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useMessages must be used within an WeavyProvider');
    }

    const getMessages = async (opt: any) => {
        let skip = opt.pageParam || 0;
        const response = await client.get("/api/apps/" + id + "/messages?orderby=createdat+desc&skip=" + skip + "&top=" + PAGE_SIZE);
        let result = await response.json();
        result.data = result.data?.reverse() || [];
        return result;
    };
    var opts = {
        ...options, 
        getNextPageParam: (lastPage:any, pages:any) => { 
            if (lastPage?.end < lastPage?.count)  {                
                return pages.length * PAGE_SIZE;
            }
        },
        select: (data: any) => ({
            // reverse scroll
            pages: [...data.pages].reverse(),
            pageParams: [...data.pageParams].reverse(),
          }),
    };
        
    return useInfiniteQuery<MessagesResult>(['messages', id], getMessages, opts)
}
