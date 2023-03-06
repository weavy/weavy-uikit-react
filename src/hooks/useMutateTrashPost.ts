import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { MessageType } from "../types/types";
import { updateCacheItem } from "../utils/cacheUtils";

/// DELETE to trash a Post
export default function useMutateTrashPost() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateTrashPost must be used within an WeavyProvider');
    }

    type MutateProps = {
        id: number | null,
        appId: number | null,
    }

    const trashPost = async ({ id }: MutateProps) => {
        const response = await client.post(`/api/posts/${id}/trash`, "POST", "");
        return response.json();
    };

    return useMutation(trashPost, {
        onSuccess: (data: any, variables: any, context: any) => {
            updateCacheItem(queryClient, ['posts', variables.appId], variables.id, (item: MessageType) => {
                item.is_trashed = data.is_trashed;
            });
        },
        onMutate: async (variables: any) => {

        }
    });
}