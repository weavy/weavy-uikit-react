import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// POST to create a new conversation
export default function useMutateChat() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateChat must be used within an WeavyProvider');
    }


    type MutateProps = {
        identifier: string,
        members: number[]
    }

    // create new conversation
    const mutateChat = async ({ identifier, members }: MutateProps) => {

        const response = await fetch(client.url + "/api/apps/", {
            method: "POST",
            body: JSON.stringify({ 
                identifier: identifier,
                members: members 
            }),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response.json();
    };

    return useMutation(mutateChat, {
        onSuccess: () => {
            //queryClient.invalidateQueries("conversations");            
        }        
    });
}