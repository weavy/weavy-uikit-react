import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PUT or DELETE to update pinned state on a conversation
export default function useMutatePinned() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutatePinned must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        pin: boolean
    }

    const mutatePinned = async ({ id, pin }: MutateProps) => {

        const response = await fetch(client.url + "/api/conversations/" + id + "/pin", {
            method:  + !pin ? "DELETE": "PUT",
            body: "",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response.json();
    };

    return useMutation(mutatePinned, {
        onSuccess: () => {
            queryClient.invalidateQueries("conversations");
        }
    });
}