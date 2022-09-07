import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// POST to create a new conversation
export default function useMutateConversation() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateConversation must be used within an WeavyProvider');
    }


    type MutateProps = {
        members: number[]
    }

    // create new conversation
    const mutateConversation = async ({ members }: MutateProps) => {

        const response = await client.post("/api/conversations/",
            "POST",
            JSON.stringify({
                members: members
            }));

        return response.json();
    };

    return useMutation(mutateConversation, {
        onSuccess: () => {
            queryClient.invalidateQueries("conversations");
        }
    });
}