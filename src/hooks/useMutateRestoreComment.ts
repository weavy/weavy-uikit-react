import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { updateCacheItem } from "../utils/cacheUtils";

/// POST to restore a Comment
export default function useMutateRestoreComment() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateRestoreComment must be used within an WeavyProvider');
    }

    type MutateProps = {
        id: number | null,
        appId: number | null, 
        parentId: number | null, 
    }

    const restoreComment = async ({ id }: MutateProps) => {
        const response = await client.post(`/api/comments/${id}/restore`, "POST", "");        
        return response.json();
    };

    return useMutation(restoreComment, {
        onSuccess: (data: any, variables: any, context: any) => {
            updateCacheItem(queryClient, ['comments', variables.parentId], variables.id, (item: MessageType) => {
                item.is_trashed = data.is_trashed;
            });
        },
        onMutate: async (variables: any) => {
         
        }
    });
}