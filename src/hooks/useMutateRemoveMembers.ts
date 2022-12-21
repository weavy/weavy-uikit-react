import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MessengerContext } from "../contexts/MessengerContext";
import { WeavyContext } from "../contexts/WeavyContext";

/// DELETE to remove members from an app
export default function useMutateRemoveMembers() {

    const { client } = useContext(WeavyContext);
    
    if (!client) {
        throw new Error('useMutateRemoveMembers must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        members: number[]
    }

    const mutateRemove = async ({ id, members }: MutateProps) => {

        const response = await client.post("/api/apps/" + id + "/members/" + members.join(","),
            "DELETE",
            JSON.stringify(members));

        return response;
    };

    return useMutation(mutateRemove);
}