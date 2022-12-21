import { useContext } from "react";
import { useMutation } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

export type UploadFileProps = {        
    file: File,
    onProgress?: (variables: UploadProgressProps) => void
}

export type UploadProgressProps = { 
    progress: number 
}

export function useUploadFile() {
    const { client } = useContext(WeavyContext);
    
    if (!client) {
        throw new Error('useMutateFile must be used within an WeavyProvider');
    }

    return async (file: File, onProgress?: (variables: UploadProgressProps) => void) => {
        const formData = new FormData();
        formData.append('blob', file);

        const response = await client.upload("/api/blobs", "POST", formData, "", 
            (progress) => {        
                if (onProgress) {
                    onProgress({ progress: progress})
                }
            });

        if (!response.ok) {
            throw <ServerErrorResponse> await response.json();
        }
        const blob: BlobType = await response.json();
        return blob;            
    };
}



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