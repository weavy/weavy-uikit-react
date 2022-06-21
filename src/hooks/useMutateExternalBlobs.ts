import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// POST to upload an external blob
export default function useMutateExternalBlobs() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateExternalBlobs must be used within an WeavyProvider');
    }


    type MutateProps = {
        blobs: []         
    }

    const mutateExternalBlobs = async ({ blobs }: MutateProps) => {

        const response = await fetch(client.url + "/api/blobs/external", {
            method: "POST",
            body: JSON.stringify(blobs),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response.json();
    };

    return useMutation(mutateExternalBlobs, {
        onSuccess: (variables: any) => {
            
        }        
    });
}