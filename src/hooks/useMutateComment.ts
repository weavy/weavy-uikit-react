import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { BlobType, MessageType } from "../types/types";
import { addCacheItem } from "../utils/cacheUtils";

/// POST to add a new comment to a parent entity
export default function useMutateComment() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateComment must be used within an WeavyProvider');
    }


    type MutateProps = {        
        parentId: number | null,
        type: "posts" | "files" | "apps",
        text: string,        
        blobs: BlobType[],
        meeting: number | null,
        embed: number | null
    }

    const mutateComment = async ({ parentId, type, text, blobs, meeting, embed }: MutateProps) => {

        const response = await client.post(`/api/${type}/${parentId}/comments`,
            "POST",
            JSON.stringify({
                text: text,
                blobs: blobs.map((b: BlobType) => { return b.id }),
                meeting_id: meeting,
                embed_id: embed
            }));
        return response.json();
    };

    return useMutation(mutateComment, {
        onSuccess: (data: MessageType, variables: any, context: any) => {
            addCacheItem(queryClient, ['comments', variables.parentId], data, context.tempId);           
        },
        onMutate: async (variables: any) => {
            await queryClient.cancelQueries(['comments', variables.parentId]);
            
            const tempId = Math.random();
            const tempData = {
                id: tempId,
                text: variables.text,                                        
                temp: true,
                created_by: {display_name: variables.userName },
                created_at: new Date().toUTCString()                    
            };

            addCacheItem(queryClient, ['comments', variables.parentId], tempData);           
            
            return { tempId }
        }
    });
}