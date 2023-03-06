import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { BlobType, MessageType, PollOptionType } from "../types/types";
import { addCacheItem } from "../utils/cacheUtils";

/// PSOT to add a new post to a Posts app
export default function useMutatePost() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutatePost must be used within an WeavyProvider');
    }


    type MutateProps = {        
        appId: number | null,
        text: string,        
        blobs: BlobType[],
        meeting: number | null,
        embed: number | null,
        options: PollOptionType[]
    }

    const mutatePost = async ({ appId, text, blobs, meeting, embed, options }: MutateProps) => {
        
        const response = await client.post("/api/apps/" + appId + "/posts",
            "POST",
            JSON.stringify({
                text: text,
                blobs: blobs.map((b: BlobType) => { return b.id }),
                meeting_id: meeting,
                embed_id: embed,
                options: options.filter((o: PollOptionType) => o.text.trim() !== "" ).map((o: PollOptionType) => { return {text: o.text}; })
            }));
        return response.json();
    };

    return useMutation(mutatePost, {
        onSuccess: (data: MessageType, variables: any, context: any) => {            
            addCacheItem(queryClient, ['posts', variables.appId], data, context.tempId, { descending: true });
        },
        onMutate: async (variables: any) => {
            await queryClient.cancelQueries(['posts', variables.appId]);
            
            const tempId = Math.random();
            const tempData = {
                id: tempId,
                text: variables.text,                                        
                temp: true,
                created_by: {display_name: variables.userName },
                created_at: new Date().toUTCString()                    
            };
            addCacheItem(queryClient, ['posts', variables.appId], tempData, undefined, { descending: true });
            
            return { tempId }
        }
    });
}