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
        read: boolean
    }

    const mutateRead = async ({ id, read }: MutateProps) => {

        const response = await fetch(client.url + "/api/conversations/" + id + "/read", {
            method:  !read ? "DELETE": "PUT",
            body: "",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response.json();
    };

    return useMutation(mutateRead, {
        onSuccess: () => {
            queryClient.invalidateQueries("conversations");
        }
    });
}