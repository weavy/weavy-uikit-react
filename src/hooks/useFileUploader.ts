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


            const response = await client.post("/api/blobs",
                "POST",
                formData,
                "");

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