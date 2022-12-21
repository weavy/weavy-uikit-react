import { useContext } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET all comment for a parent
export default function useCommentList(parentId: number | null, type: "posts" | "files" | "apps", options: any) {
    const PAGE_SIZE = 10;
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useCommentList must be used within an WeavyProvider');
    }

    const getPosts = async (opt: any) => {
        let skip = opt.pageParam || 0;        
        const response = await client.get(`/api/${type}/${parentId}/comments?orderby=createdat+asc&skip=${skip}&top=${PAGE_SIZE}`);

        return await response.json();        
    };
    var opts = {
        ...options, 
        getNextPageParam: (lastPage:any, pages:any) => { 
            if (lastPage?.end < lastPage?.count)  {                
                return pages.length * PAGE_SIZE;
            }
        }        
    };
        
    return useInfiniteQuery<MessagesResult>(["comments", parentId], getPosts, opts)
}
