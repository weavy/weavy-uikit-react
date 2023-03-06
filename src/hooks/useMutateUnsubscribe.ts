import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { MessageType } from "../types/types";
import { updateCacheItem } from "../utils/cacheUtils";

/// POST to unsubscribe
export default function useMutateUnsubscribe() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateUnsubscribe must be used within an WeavyProvider');
    }

    type MutateProps = {
        id: number | null,
        appId: number | null, 
    }

    const unsubscribe = async ({ id }: MutateProps) => {
        const response = await client.post(`/api/posts/${id}/unsubscribe`, "POST", "");        
        return response.json();
    };

    return useMutation(unsubscribe, {
        onSuccess: (data: any, variables: any, context: any) => {
            updateCacheItem(queryClient, ['posts', variables.appId], variables.id, (item: MessageType) => {
                item.is_subscribed = data.is_subscribed;
            });
        },
        onMutate: async (variables: any) => {
         
        }
    });
}