import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { updateCacheItem } from "../utils/cacheUtils";

/// POST to update a Post
export default function useMutateRestorePost() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateRestorePost must be used within an WeavyProvider');
    }

    type MutateProps = {
        id: number | null,
        appId: number | null, 
    }

    const restorePost = async ({ id }: MutateProps) => {
        const response =  await client.post(`/api/posts/${id}/restore`, "POST", "");        
        return response.json();  
    };

    return useMutation(restorePost, {
        onSuccess: (data: any, variables: any, context: any) => {
            updateCacheItem(queryClient, ['posts', variables.appId], variables.id, (item: MessageType) => {
                item.is_trashed = data.is_trashed;
            });
        },
        onMutate: async (variables: any) => {
         
        }
    });
}