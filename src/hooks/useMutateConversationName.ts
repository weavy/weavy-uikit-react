import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PUT to update an app name
export default function useMutateConversationName() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateConversationName must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        name: string | null
    }

    const mutateConversationName = async ({ id, name }: MutateProps) => {

        const response = await client.post("/api/apps/" + id,
            "PATCH",
            JSON.stringify({
                type: 'ChatRoom',
                name: name
            }));

        return response.json();
    };

    return useMutation(mutateConversationName, {
        onSuccess: (data: any, variables: any, context: any) => {
            queryClient.invalidateQueries("conversations");
            queryClient.invalidateQueries(["conversation", variables.id]);
        }
    });
}