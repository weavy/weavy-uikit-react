import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../contexts/UserContext";
import { WeavyContext } from "../contexts/WeavyContext";
import { MessageType, ReactableType } from "../types/types";
import { updateCacheItem } from "../utils/cacheUtils";

/// DELETE to remove a reaction from a message
export default function useMutateDeleteReaction() {

    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateDeleteReaction must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        parentId: number | null,
        type: "messages" | "posts" | "comments",
        reaction: string
    }

    const mutateDeleteReaction = async ({ id, type }: MutateProps) => {

        // remove the existing reaction
        const response = await client.post(`/api/${type}/${id}/reactions`,
        "DELETE",
        "");

        return response;
    };

    return useMutation(mutateDeleteReaction, {
        onSuccess: (data: any, variables: any, context: any) => {
            
        },
        onMutate: async (variables: any) => {
            updateCacheItem(queryClient, [variables.type, variables.parentId], variables.id, (item: MessageType) => {
                item.reactions = [...item.reactions.filter((r: ReactableType) => r.created_by_id !== user.id )];
            });
        }
    });    
}