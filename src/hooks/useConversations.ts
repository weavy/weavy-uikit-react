import { useContext } from "react";
import { useInfiniteQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { ConversationsResult } from "../types/types";

/// GET all conversations
export default function useConversations(options: any) {
    const { client } = useContext(WeavyContext);
    const PAGE_SIZE = 25;

    if (!client) {
        throw new Error('useConversations must be used within an WeavyProvider');
    }

    const getConversations = async (opt: any) => {
        let skip = opt.pageParam || 0;
        const response = await client.get("/api/conversations?contextual=false&skip=" + skip + "&top=" + PAGE_SIZE);
        const data = await response.json();                        
        return data;
    };

    var opts = {
        ...options, 
        getNextPageParam: (lastPage:any, pages:any) => { 
            if (lastPage?.end < lastPage?.count)  {                
                return pages.length * PAGE_SIZE;
            }
        }      
    };

    return useInfiniteQuery<ConversationsResult>("conversations", getConversations, opts);
}
