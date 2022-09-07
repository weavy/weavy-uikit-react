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

        const response = await client.post("/api/blobs/external",
            "POST",
            JSON.stringify(blobs));

        return response.json();
    };

    return useMutation(mutateExternalBlobs, {
        onSuccess: (variables: any) => {

        }
    });
}