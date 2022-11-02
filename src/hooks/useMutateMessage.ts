import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

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
        attachments: [],
        meetings: MeetingType[]
    }

    const mutateMessage = async ({ id, text, userId, attachments, meetings }: MutateProps) => {

        const response = await client.post("/api/apps/" + id + "/messages",
            "POST",
            JSON.stringify({
                text: text,
                blobs: attachments.map((a: FileType) => { return a.id }),
                meeting_id: meetings.length > 0 ? meetings[0].id : null
            }));
        return response.json();
    };

    return useMutation(mutateMessage, {
        onSuccess: (data: MessageType, variables: any, context: any) => {

            const previousData = queryClient.getQueryData<any>(['messages', variables.id]);
            if (previousData && previousData.pages) {
                // update cache
                const newPagesArray = previousData.pages.map((page: any, i: number) => {
                    // remove temp message                    
                    if (i === 0) {
                        page.data = [
                            ...page.data.filter((message: MessageType) => message.id !== context.tempId),
                            data
                        ]
                    }

                    return page;

                }) ?? [];

                queryClient.setQueryData(["messages", variables.id], (data: any) => ({
                    pages: newPagesArray,
                    pageParams: data.pageParams,
                }));
            }

            // refetch conversations list
            queryClient.invalidateQueries("conversations");

        },
        onMutate: async (variables: any) => {
            await queryClient.cancelQueries(['messages', variables.id]);

            const previousData = queryClient.getQueryData<any>(['messages', variables.id]);
            const tempId = Math.random();

            if (previousData && previousData.pages.length > 0) {

                var lastPage = previousData.pages[0]; // in reverse order

                // add temp message 
                var data = lastPage.data || [];
                let pageMessages = [...data, {
                    id: tempId,
                    text: variables.text,
                    html: variables.text,
                    display_name: "",
                    temp: true,
                    parent_id: null,
                    created_by: { id: variables.userId },
                    created_at: new Date().toUTCString(),
                    attachments: [],
                    reactions: [],
                    reactions_count: 0
                }];
                lastPage.data = pageMessages;

                // update cache
                queryClient.setQueryData(["messages", variables.id], (data: any) => {
                    let updatedPages = [lastPage];
                    if (data?.pages.length > 1) {
                        updatedPages = [lastPage, ...data?.pages.slice(1)];
                    }
                    return {
                        pages: updatedPages,
                        pageParams: data?.pageParams,
                    }
                });
            }

            return { tempId }
        }
    });
}