import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PATCH to update a Comment
export default function useMutateEditPost() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateEditComment must be used within an WeavyProvider');
    }

    type MutateProps = {
        id: number | null,
        appId: number | null,
        parentId: number | null,
        text: string,
        blobs: BlobType[],
        attachments: FileType[],
        meeting: number | null,
        embed: number | null
    }

    const mutatePost = async ({ id, text, blobs, attachments, meeting, embed }: MutateProps) => {

        const response = await client.post("/api/comments/" + id,
            "PATCH",
            JSON.stringify({
                text: text,
                blobs: blobs.map((b: BlobType) => { return b.id }),
                attachments: attachments.map((a: FileType) => { return a.id }),
                meeting_id: meeting,
                embed_id: embed
            }));
        return response.json();
    };

    return useMutation(mutatePost, {
        onSuccess: (data: MessageType, variables: any, context: any) => {

            const previousData = queryClient.getQueryData<any>(['comments', variables.parentId]);
            
            if (previousData && previousData.pages) {
                // update cache
                const newPagesArray = previousData.pages.map((page: any, i: number) => {
                    // update comment
                    page.data = [...page.data.map((message: MessageType) => message.id === variables.id ? data : message)]                    
                    return page;
                }) ?? [];

                queryClient.setQueryData(["comments", variables.parentId], (data: any) => ({
                    pages: newPagesArray,
                    pageParams: data.pageParams,
                }));
            }
        },
        onMutate: async (variables: any) => {
         
        }
    });
}