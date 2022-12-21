import { useContext } from "react";
import { MutationKey, useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { updateCacheItem } from "../utils/cacheUtils";

/// PATCH to update a File
export default function useMutateFileRename(filesKey: MutationKey) {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateFileRename must be used within an WeavyProvider');
    }

    type MutateProps = {
        file: FileType,
        name: string,
    }

    const mutateRename = async ({ file, name }: MutateProps) => {
        if (file.id >=1) {
            const response = await client.post("/api/files/" + file.id,
                "PATCH",
                JSON.stringify({
                    name: name
                }));

            if (!response.ok) {
                throw <ServerErrorResponse> await response.json();
            }

            return response.json();
        } else {
            throw new Error(`Could not rename ${file.name}`);
        }
    };

    return useMutation<FileType, ServerErrorResponse, MutateProps, void>(mutateRename, {
        onMutate: async (variables: MutateProps) => {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, { name: variables.name }));
        },
        onSuccess: (data: FileType, variables: MutateProps, context: any) => {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, data, { status: "ok" }));
        },
        onError(error, variables: MutateProps, context) {
            // Show/update in mutation list also?
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, { name: variables.file.name }));
        },
    });
}