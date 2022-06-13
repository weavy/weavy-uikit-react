import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// POST to create a new meeting
export default function useMutateMeeting() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateMeeting must be used within an WeavyProvider');
    }


    type MutateProps = {
        provider: string         
    }

    const mutateMeeting = async ({ provider }: MutateProps) => {

        const response = await fetch(client.uri + "/api/meetings", {
            method: "POST",
            body: JSON.stringify({provider: provider}),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response.json();
    };

    return useMutation(mutateMeeting, {
        onSuccess: (variables: any) => {
            
        }        
    });
}