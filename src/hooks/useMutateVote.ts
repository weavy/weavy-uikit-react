import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../contexts/UserContext";
import { WeavyContext } from "../contexts/WeavyContext";
import { updateCacheItem } from "../utils/cacheUtils";
//import usePost from "./usePost";

/// POST to vote on an option
export default function useMutateVote() {
    const queryClient = useQueryClient();
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useMutateVote must be used within an WeavyProvider');
    }
    //const { refetch } = usePost(parentId, { enabled: false });

    type MutateProps = {
        id: number,
        appId: number,
        parentId: number
    }

    const mutateVote = async ({ id }: MutateProps) => {
        const response = await client.post(`/api/options/${id}/vote`, "POST", "");
        return response.json();
    };

    return useMutation(mutateVote, {
        onSuccess: async (data: any, variables: any, context: any) => {            
            const response = await client.get("/api/posts/" + variables.parentId);
            let json = await response.json();            
            // update cache
            updateCacheItem(queryClient, ["posts", variables.appId], variables.parentId, (item: MessageType) => {
                item.options = json.options;
            });            
        },
        onMutate: async (variables: any) => {            
            updateCacheItem(queryClient, ["posts", variables.appId], variables.parentId, (item: MessageType) => {
                item.options = item.options?.map((o: PollOptionType) => {

                    if (o.has_voted) {
                        o.has_voted = false;
                        let count = o.vote_count || 1;
                        o.vote_count = count - 1;
                    } else if (!o.has_voted && o.id === variables.id) {
                        o.has_voted = true;
                        let count = o.vote_count || 0;
                        o.vote_count = count + 1;
                    }

                    return o;
                }
                );
            });
        }
    });

}