import { useContext } from "react";
import { useMutation } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PUT to add typing to a conversation
export default function useMutateTyping() {

    const { client } = useContext(WeavyContext);
    
    if (!client) {
        throw new Error('useMutateTyping must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null        
    }

    const mutateTyping = async ({ id }: MutateProps) => {

        const response = await fetch(client.url + "/api/conversations/" + id + "/typing", {
            method: "PUT",
            body: JSON.stringify({}),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response;
    };

    return useMutation(mutateTyping, { });
}