import { useContext } from "react";
import { useMutation } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { IWeavyClient } from "../types/types";

/// POST to upload an external blob
export default function useMutateExternalBlobs(client: IWeavyClient) {

    if (!client) {
        throw new Error('useMutateExternalBlobs must be used within an WeavyProvider');
    }


    type MutateProps = {
        blob: any
    }

    const mutateExternalBlobs = async ({ blob }: MutateProps) => {        
        const response = await client.post("/api/blobs/external",
            "POST",
            JSON.stringify(blob));

        return response.json();
    };

    return useMutation(mutateExternalBlobs, {
        onSuccess: (variables: any) => {

        }
    });
}