import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { BlobType, MessageType } from "../types/types";
import { addCacheItem } from "../utils/cacheUtils";

/// PSOT to add a new message to an app
export default function useMutateMessage() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateMessage must be used within an WeavyProvider');
    }

    type MutateProps = {
        id: number | null,
        text: string,
        userId: number,
        blobs: BlobType[],
        meeting: number | null,
        callback: Function
    }

    const mutateMessage = async ({ id, text, blobs, meeting }: MutateProps) => {
        const response = await client.post("/api/apps/" + id + "/messages",
            "POST",
            JSON.stringify({
                text: text,
                blobs: blobs.map((b: BlobType) => { return b.id }),
                meeting_id: meeting,
            }));
        return response.json();
    };

    return useMutation(mutateMessage, {
        onSuccess: (data: MessageType, variables: any, context: any) => {            
            addCacheItem(queryClient, ['messages', variables.id], data, context.tempId);            
            // refetch conversations list
            queryClient.invalidateQueries("conversations");
        },
        onMutate: async (variables: any) => {            
            await queryClient.cancelQueries(['messages', variables.id]);

            const tempId = Math.random();
            const tempData: MessageType = {
                id: tempId,
                app_id: -1,
                attachment_ids: [],
                is_subscribed: true,
                is_trashed: false,                
                text: variables.text,
                html: variables.text,                
                plain: variables.text,                
                temp: true,  
                created_by_id: variables.userId,              
                created_by: { id: variables.userId, avatar_url: "", display_name: "", presence: "", name: "" },
                created_at: new Date().toUTCString(),
                attachments: [],
                reactions: []                                
            }
            addCacheItem(queryClient, ['messages', variables.id], tempData);
            
            variables.callback();

            return { tempId }
        }
    });
}