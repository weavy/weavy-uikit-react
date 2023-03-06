import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../contexts/UserContext";
import { WeavyContext } from "../contexts/WeavyContext";
import { MessageType } from "../types/types";
import { updateCacheItem } from "../utils/cacheUtils";

/// POST to add a reaction to a message
export default function useMutateReaction() {

    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateReaction must be used within an WeavyProvider');
    }

    type MutateProps = {
        parentId: number | null,
        id: number | null,
        type: "messages" | "posts" | "comments",
        reaction: string
    }

    const mutateReaction = async ({ id, type, reaction }: MutateProps) => {
        
        const response = await client.post(`/api/${type}/${id}/reactions`,
            "POST",
            JSON.stringify({ content: reaction }));

        return response;
    };

    return useMutation(mutateReaction, {
        onSuccess: (data: any, variables: any, context: any) => {
          
        },
        onMutate: async (variables: any) => {
            updateCacheItem(queryClient, [variables.type, variables.parentId], variables.id, (item: MessageType) => {
                item.reactions = item.reactions || [];                
                item.reactions = [...item.reactions, { content: variables.reaction, created_by_id: user.id }];
            });
        }
    });


}