import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PUT or DELETE to update read state on a conversation
export default function useMutateRead() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateUnread must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        read: boolean,
        messageId: number | null
    }

    const mutateRead = async ({ id, read, messageId }: MutateProps) => {
        const url = read ? `/api/conversations/${id}/read?messageId=${messageId}`: `/api/conversations/${id}/read`;
        const response = await client.post(url, !read ? "DELETE": "PUT", "")
        return response.json();
    };

    return useMutation(mutateRead, {
        onSuccess: () => {
            queryClient.invalidateQueries("conversations");
        }
    });
}