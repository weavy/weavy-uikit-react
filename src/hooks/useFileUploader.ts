import { useContext } from "react";
import { useMutation } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// POST to upload a a file
export default function useFileUploader(callback: Function) {

    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useFileUploader must be used within an WeavyProvider');
    }

    return useMutation(
        async ({ request }: any) => {

            const formData = new FormData();
            formData.append('blob', request.file);

            var response = await fetch(client.url + "/api/blobs", {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": "Bearer " + await client.tokenFactory()
                }
            });

            var uploaded = await response.json();
            callback(uploaded);
        },
        {
            onError: (e: any) => {

            },
            onSuccess: (data: any, variables: any) => {                
            },
        }
    );
}