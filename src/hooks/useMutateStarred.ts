import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PUT or DELETE to update starred state on a conversation
export default function useMutateStarred() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateStarred must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        star: boolean
    }

    const mutateStarred = async ({ id, star }: MutateProps) => {

        const response = await client.post("/api/apps/" + id + "/stars",
            !star ? "DELETE" : "POST",
            "");

        return response;
    };

    return useMutation(mutateStarred, {
        onSuccess: () => {
            queryClient.invalidateQueries("conversations");
        }
    });
}