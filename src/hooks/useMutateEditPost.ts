import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PATCH to update a Post
export default function useMutateEditPost() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateEditPost must be used within an WeavyProvider');
    }

    type MutateProps = {
        id: number | null,
        appId: number | null,
        text: string,
        blobs: BlobType[],
        attachments: FileType[],
        options: PollOptionType[],
        meeting: number | null,
        embed: number | null
    }

    const mutatePost = async ({ id, text, blobs, attachments, meeting, embed, options }: MutateProps) => {

        const response = await client.post("/api/posts/" + id,
            "PATCH",
            JSON.stringify({
                text: text,
                blobs: blobs.map((b: BlobType) => { return b.id }),
                attachments: attachments.map((a: FileType) => { return a.id }),
                meeting_id: meeting,
                embed_id: embed,
                options: options.filter((o: PollOptionType) => o.text.trim() !== "").map((o: PollOptionType) => { return { id: o.id, text: o.text }; })
            }));
        return response.json();
    };

    return useMutation(mutatePost, {
        onSuccess: (data: MessageType, variables: any, context: any) => {

            const previousData = queryClient.getQueryData<any>(['posts', variables.appId]);

            if (previousData && previousData.pages) {
                // update cache
                const newPagesArray = previousData.pages.map((page: any, i: number) => {
                    // update post
                    page.data = [...page.data.map((message: MessageType) => message.id === variables.id ? data : message)]
                    return page;
                }) ?? [];

                queryClient.setQueryData(["posts", variables.appId], (data: any) => ({
                    pages: newPagesArray,
                    pageParams: data.pageParams,
                }));
            }
        },
        onMutate: async (variables: any) => {

        }
    });
}