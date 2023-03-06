import { useContext } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { MessagesResult } from "../types/types";

/// GET all posts in an app
export default function usePostsList(id: number | null, options: any) {
    const PAGE_SIZE = 10;
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('usePostsList must be used within an WeavyProvider');
    }

    const getPosts = async (opt: any) => {
        let skip = opt.pageParam || 0;
        const response = await client.get("/api/apps/" + id + "/posts?orderby=createdat+desc&skip=" + skip + "&top=" + PAGE_SIZE);
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
        
    return useInfiniteQuery<MessagesResult>(['posts', id], getPosts, opts)
}
