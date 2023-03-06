import { useContext } from "react";
import { WeavyContext } from "../contexts/WeavyContext";
import { FileType, ServerErrorResponse } from "../types/types";
import { CreateFileProps } from "./useMutateFile";

export const useMutateFilesCreate = (appId: number) => {
    const { client } = useContext(WeavyContext);
    
    if (!client) {
        throw new Error('useMutateFile must be used within an WeavyProvider');
    }

    return async ({ blob, replace = false }: CreateFileProps) => {
        const response = await client.post("/api/apps/" + appId + "/files",
            "POST",
            JSON.stringify({ blob_id: blob.id, replace: replace }));

        if (!response.ok) {
            throw <ServerErrorResponse> await response.json();
        }
        
        return <FileType> await response.json();
    }
}