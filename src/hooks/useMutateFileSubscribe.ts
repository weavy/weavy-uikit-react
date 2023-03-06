import { useContext } from "react";
import { MutationKey, useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { FileType, ServerErrorResponse } from "../types/types";
import { updateCacheItem } from "../utils/cacheUtils";

export function useMutateFileSubscribe(filesKey: MutationKey) {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateFileSubscribe must be used within an WeavyProvider');
    }

    type MutateProps = {
        file: FileType
    }

    const subscribeMutation = useMutation(async ({ file }: MutateProps) => {
        if (file.id >= 1) {
            const response = await client.post("/api/files/" + file.id + "/subscribe", "POST", "");
            if (!response.ok) {
                throw await response.json();
            }
            return response.json();
        } else {
            throw new Error(`Could not subscribe to ${file.name}.`);
        }
    },{
        onMutate: async (variables: MutateProps) => {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, { is_subscribed: true, status: "pending" }));
        },
        onSuccess: (data: FileType, variables: MutateProps, context: any) => {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, data, { status: "ok" }));
        },
        onError(error: any, variables: MutateProps, context: any) {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, { is_subscribed: variables.file.is_subscribed, status: "error" }));
        },
    });

    return subscribeMutation;
}

export function useMutateFileUnsubscribe(filesKey: MutationKey) {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateFileUnsubscribe must be used within an WeavyProvider');
    }

    type MutateProps = {
        file: FileType
    }

    const unsubscribeMutation = useMutation<FileType, ServerErrorResponse, MutateProps, any>(async ({ file }: MutateProps) => {
        if (file.id >= 1) {
            const response = await client.post("/api/files/" + file.id + "/unsubscribe", "POST", "");
            if (!response.ok) {
                throw <ServerErrorResponse> await response.json();
            }
            return response.json();
        } else {
            throw new Error(`Could not unsubscribe to ${file.name}.`);
        }
    },{
        onMutate: async (variables: MutateProps) => {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, { is_subscribed: false }));
        },
        onSuccess: (data: FileType, variables: MutateProps, context: any) => {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, data, { status: "ok" }));
        },
        onError(error: any, variables: MutateProps, context: any) {
            updateCacheItem(queryClient, filesKey, variables.file.id, (existingFile: FileType) => Object.assign(existingFile, { is_subscribed: variables.file.is_subscribed }));
        },
    });

    return unsubscribeMutation;
}