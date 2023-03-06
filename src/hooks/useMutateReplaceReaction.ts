import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../contexts/UserContext";
import { WeavyContext } from "../contexts/WeavyContext";
import { MessageType, ReactableType } from "../types/types";
import { updateCacheItem } from "../utils/cacheUtils";

/// Replaces a reaction from on message
export default function useMutateReplaceReaction() {

    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateReplaceReaction must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        parentId: number | null,
        type: "messages" | "posts" | "comments",
        reaction: string
    }

    const mutateReplaceReaction = async ({ id, type, reaction }: MutateProps) => {

        // remove the existing reaction
        await client.post(`/api/${type}/${id}/reactions`,
        "DELETE",
        "");

        // add the new reaction
        const response = await client.post(`/api/${type}/${id}/reactions`,
            "POST",
            JSON.stringify({ content: reaction }));

        return response;
    };

    return useMutation(mutateReplaceReaction, {
        onSuccess: (data: any, variables: any, context: any) => {

        },
        onMutate: async (variables: any) => {
            updateCacheItem(queryClient, [variables.type, variables.parentId], variables.id, (item: MessageType) => {
                item.reactions = item.reactions.map((r: ReactableType) => {
                    if(r.created_by_id !== user.id){
                        return r;
                    }
                    // replace reaction
                    r.content = variables.reaction;
                    return r;
                     
                });
            });
        }
    });    
}