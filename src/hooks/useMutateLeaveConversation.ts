import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MessengerContext } from "../contexts/MessengerContext";
import { WeavyContext } from "../contexts/WeavyContext";

/// DELETE leave conversation
export default function useMutateLeaveConversation() {

    const { client } = useContext(WeavyContext);
    const { setSelectedConversationId } = useContext(MessengerContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateLeaveConversation must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        members: number[]
    }

    const mutateLeave = async ({ id, members }: MutateProps) => {

        const response = await client.post("/api/apps/" + id + "/members/" + members.join(","),
            "DELETE",
            JSON.stringify(members));

        return response;
    };

    return useMutation(mutateLeave, {
        onSuccess: () => {
            queryClient.invalidateQueries("conversations");
            setSelectedConversationId(null);
        }
    });
}