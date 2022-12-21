import { useContext } from "react";
import { MutationKey, useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { removeCacheItem, updateCacheItem } from "../utils/cacheUtils";

export function useMutateFileVersionRestore(filesKey: MutationKey) {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateFileVersion must be used within an WeavyProvider');
    }

    type MutateProps = {
        versionFile: FileType
    }

    const restoreMutation = useMutation(async ({ versionFile }: MutateProps) => {
        if (versionFile.id >= 1 && versionFile.version) {
            const response = await client.post(`/api/files/${versionFile.id}/versions/${versionFile.version}/restore`, "POST", "");
            return response.json();
        } else {
            throw new Error(`Could not restore ${versionFile.name} to version ${versionFile.version}.`);
        }
    },{
        onMutate: async (variables: MutateProps) => {
            var previousFile:FileType | undefined;
            updateCacheItem(queryClient, filesKey, variables.versionFile.id, (existingFile: FileType) => {previousFile = existingFile; return Object.assign(existingFile, variables.versionFile, { status: "pending" })});
            updateCacheItem(queryClient, [...filesKey, variables.versionFile.id, "versions"], variables.versionFile.id, (existingFile: FileType) => {previousFile = existingFile; return Object.assign(existingFile, { status: "pending" })});
            return {versionFile: variables.versionFile, previousFile: previousFile }
        },
        onSuccess: (data: MessageType, variables: MutateProps, context: any) => {
            updateCacheItem(queryClient, filesKey, variables.versionFile.id, (existingFile: FileType) => Object.assign(existingFile, data, { status: "ok" }));
            queryClient.removeQueries([...filesKey, variables.versionFile.id, "versions"]);
        },
        onError(error: any, variables: MutateProps, context: any) {
            updateCacheItem(queryClient, filesKey, variables.versionFile.id, (existingFile: FileType) => Object.assign(existingFile, context.previousFile, { status: "error" }));
            updateCacheItem(queryClient, [...filesKey, variables.versionFile.id, "versions"], variables.versionFile.id, (existingFile: FileType) => Object.assign(existingFile, { status: "error" }));
        },
    });

    return restoreMutation;
}

export function useMutateFileVersionDelete(filesKey: MutationKey) {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateFileVersionRemove must be used within an WeavyProvider');
    }

    type MutateProps = {
        versionFile: FileType
    }

    const deleteMutation = useMutation(async ({ versionFile }: MutateProps) => {
        if (versionFile.id >= 1 && versionFile.version) {
            const response = await client.post(`/api/files/${versionFile.id}/versions/${versionFile.version}`, "DELETE", "");
            if (!response.ok) {
                throw <ServerErrorResponse> await response.json();
            }
        } else {
            throw <ServerErrorResponse> { status: 400, title: `Could not remove ${versionFile.name} version ${versionFile.version}.`};
        }
    },{
        onMutate: async (variables: MutateProps) => {
            const versionPredicate = (item: any) => item.id === variables.versionFile.id && item.version === variables.versionFile.version;
            updateCacheItem(queryClient, [...filesKey, variables.versionFile.id, "versions"], versionPredicate, (existingFile: FileType) => Object.assign(existingFile, { status: "pending" }));
        },
        onSuccess: (data: any, variables: MutateProps, context: any) => {
            const versionPredicate = (item: any) => item.id === variables.versionFile.id && item.version === variables.versionFile.version;
            removeCacheItem(queryClient, [...filesKey, variables.versionFile.id, "versions"], versionPredicate);
        },
        onError(error: any, variables: MutateProps, context: any) {
            // Show in error list instead?
            const versionPredicate = (item: any) => item.id === variables.versionFile.id && item.version === variables.versionFile.version;
            updateCacheItem(queryClient, [...filesKey, variables.versionFile.id, "versions"], versionPredicate, (existingFile: FileType) => Object.assign(existingFile, { status: undefined }));
        },
    });

    return deleteMutation;
}