import { useContext, useEffect, useState } from "react";
import { InfiniteData, Mutation, MutationKey, QueryClient, QueryKey, useMutation, useQueryClient } from "react-query";
import { addCacheItem, findAnyExistingItem, removeCacheItem, updateCacheItem } from "../utils/cacheUtils";
import { UserContext } from "../contexts/UserContext";
import { getKind, getWebPreviewFormat } from "../utils/fileUtilities";
import { UploadProgressProps, useUploadFile } from "./useFileUploader";

export type CreateFileProps = {        
    blob: BlobType,
    file?: FileType,
    replace?: boolean
}

export type MutateFileProps = {
    file: File,
    onProgress?: (variables: UploadProgressProps) => void // Hack to be able to pass a progress function in the mutation.
}

export type MutationFileContext = {
    file: FileType,
    blob: BlobType
}

export type FileMutation = Mutation<FileType|BlobType, ServerErrorResponse, MutateFileProps, MutationFileContext | undefined>;

export function isFileMutation(mutation: unknown): mutation is FileMutation {
    return (mutation as FileMutation).state !== undefined;
  }

const getTempFile = (file: File | URL | undefined, name: string, size: number = 0, type: string = "application/octet-stream", refId: number, user: UserType) => {
    const srcUrl = file && (file instanceof URL ? file.toString() : URL.createObjectURL(file));
    const tempFile: FileType = {
        id: refId,
        refId: refId,
        name: name,
        kind: getKind(name),
        size: size,
        media_type: type,
        embed_url: "",
        preview_format: getWebPreviewFormat(name),    
        thumbnail_url: srcUrl,   
        preview_url: srcUrl,          
        download_url: srcUrl,          
        version: -1,
        created_by: user,
        created_by_id: user.id,
        created_at: new Date().toUTCString(),
        is_subscribed: false,
        is_trashed: false,
        status: "pending"                  
    };
    return tempFile;
}

const setMutationContext = (queryClient: QueryClient, mutationKey: MutationKey, variables: any, contextMutation: (context: any) => void) => {
    // Needed to be able to use the blob on errors
    let mutation = <FileMutation>queryClient.getMutationCache().find({ mutationKey: mutationKey, predicate: (mutation) => {
        return (mutation as FileMutation).options.variables === variables;
    }});

    if (mutation && mutation.state.context) {
        let newContext = {...mutation.state.context};
        contextMutation(newContext);
        mutation.setState({...mutation.state, context: newContext})
    }
}

export function useMutatingFileUploads(filesKey: MutationKey) {

    const queryClient = useQueryClient();

    const [mutations, setMutations] = useState<FileMutation[]>([])
    const [status, setStatus] = useState<string>();
    const [progress, setProgress] = useState<number>();

    const getProgress = (mutations: FileMutation[]) => mutations.reduce((combinedProgress, mutation) => {
        let file = mutation.state.context?.file as FileType;
        if (file && file.progress && file.size) {
            return { 
                loaded: combinedProgress.loaded + file.progress * file.size,
                total: combinedProgress.total + file.size
            }
        }
        return combinedProgress;
    }, { loaded: 0, total: 0 });

    const getStatus = (mutations: FileMutation[]) => 
        mutations.some((mutation) => mutation.state.error?.status === 409) ? "conflict" : 
        mutations.some((mutation) => mutation.state.status === "error") ? "error" : 
        mutations.every((mutation) => mutation.state.status === "success") ? "ok" : 
        "pending";

    const updateMutations = () => {
        let newMutations = <unknown>queryClient.getMutationCache().findAll({
            mutationKey: filesKey
        }) as FileMutation[];
        
        setMutations(newMutations);
    }

    useEffect(() => {
        updateMutations()
        return queryClient.getMutationCache().subscribe(() => updateMutations())        
    }, [...filesKey])

    useEffect(() => {
        setStatus(getStatus(mutations));
        
        let totalProgress = getProgress(mutations);

        setProgress(totalProgress.total > 0 ? totalProgress.loaded / totalProgress.total : undefined)
    }, [mutations])

    return {
        mutations,
        status,
        progress
    };
}

export function useRemoveMutatingFileUpload(filesKey: MutationKey) {
    const queryClient = useQueryClient();
    const mutationKey: MutationKey = filesKey;

    return (mutation: FileMutation) => {
        if (queryClient.getMutationCache().find({ mutationKey: mutationKey, predicate: (m) => m === mutation })) {
            updateCacheItem(queryClient, filesKey, mutation.state.context!.file?.refId || mutation.state.context!.file?.id, (file: FileType) => Object.assign(file, { status: "ok", statusText: undefined, progress: undefined }));
            queryClient.getMutationCache().remove(mutation); 
        }
    }
}

export function useClearMutatingFileUpload(filesKey: MutationKey) {
    const queryClient = useQueryClient();
    const mutationKey: MutationKey = filesKey;

    return () => {
        let mutations = queryClient.getMutationCache().findAll({ mutationKey: mutationKey });
        mutations.forEach((mutation) => {
            if (isFileMutation(mutation)) {
                updateCacheItem(queryClient, filesKey, mutation.state.context?.file?.refId || mutation.state.context!.file?.id, (file: FileType) => Object.assign(file, { status: "ok", statusText: undefined, progress: undefined }));
            }
            queryClient.getMutationCache().remove(mutation); 
        });
        
    }
}

/// Upload mutation to upload and add a new file for a <FileType> query
export function useMutateFileUpload(filesKey: QueryKey, createFile?: ({ blob, replace }: CreateFileProps) => Promise<FileType>) {
    const queryClient = useQueryClient();
    const { user } = useContext(UserContext);

    const mutationKey: MutationKey = filesKey;

    /// POST to upload a a file
    const uploadFile = useUploadFile();
    
    return useMutation(async (variables: MutateFileProps) => {
        let uploadedFile = await uploadFile(variables.file, variables.onProgress);
        
        // Needed to be able to use the blob on errors
        setMutationContext(queryClient, mutationKey, variables, (context) => {
            context.blob = uploadedFile;
        })
        
        return createFile ? await createFile({ blob: uploadedFile }) : uploadedFile;
    }, {
        mutationKey: mutationKey,
        onMutate: async (variables: MutateFileProps) => {    
            await queryClient.cancelQueries({ queryKey: filesKey, exact: true});
            
            let files = queryClient.getQueryData<InfiniteData<FilesResult>>(filesKey);
            let file = findAnyExistingItem<FileType>(files, "name", variables.file.name, true);

            
            if (!file) {
                // If non existing add optimistic update
                const meta = queryClient.getQueryCache().find<FilesResult>(filesKey)?.meta;
                const order = meta?.order as FileOrder;

                let refId = Math.random();

                file = getTempFile(variables.file, variables.file.name, variables.file.size, variables.file.type, refId, user);
                addCacheItem(queryClient, filesKey, file, file.id, order);
            }
                    
            variables.onProgress = ({progress}) => {
                if (file?.id) {
                    updateCacheItem(queryClient, filesKey, file.refId || file.id, (cacheFile: FileType) => Object.assign(cacheFile, { status: "pending", progress: progress }));   
                }

                setMutationContext(queryClient, mutationKey, variables, (context) => {
                    context.file.progress = progress;
                    context.file.status = "pending";
                })
            }
        
            return <MutationFileContext>{ file }
        },
        onSuccess: (data: FileType | BlobType, variables: MutateFileProps, context: MutationFileContext | undefined) => {   
            if (context?.file?.id) {
                updateCacheItem(queryClient, filesKey, context.file.id, (file: FileType) => Object.assign(file, data as FileType || context?.file, { status: "ok", statusText: undefined, progress: undefined }));
            }
            setMutationContext(queryClient, mutationKey, variables, (context) => {
                context.file.progress = undefined;
                context.file.status = "ok";
                context.file.statusText = undefined;
            });
            queryClient.invalidateQueries({queryKey: filesKey});
        },
        onError(error: ServerErrorResponse, variables: MutateFileProps, context: MutationFileContext | undefined) {
            if (error && error.status === 409) {
                if (context?.file?.id) {
                    updateCacheItem(queryClient, filesKey, context.file.id, (file: FileType) => Object.assign(file, { status: "conflict", statusText: error.detail || error.title, progress: undefined }));
                }
                setMutationContext(queryClient, mutationKey, variables, (context) => {
                    context.file.progress = undefined;
                    context.file.status = "conflict";
                    context.file.statusText = error.detail || error.title;
                })
            } else {
                if(context?.file?.id) {
                    if (context.file.id >= 1) {
                        updateCacheItem(queryClient, filesKey, context.file.id, (file: FileType) => Object.assign(file, { status: "error", statusText: error.detail || error.title, progress: undefined }));
                    } else if(context.file.id >= 0 && context.file.id < 1) {
                        removeCacheItem(queryClient, filesKey, context.file.id);
                    }
                }
                setMutationContext(queryClient, mutationKey, variables, (context) => {
                    if (context) {
                        context.file.progress = undefined;
                        context.file.status = "error";
                        context.file.statusText = error.detail || error.title;
                    }
                })
            }
        },
    });
}

/// Mutation for adding a <BlobType> to a <FileType> query
export function useMutateFileCreate(filesKey: QueryKey, createFile: ({ blob, file, replace }: CreateFileProps) => Promise<FileType>) {
    const queryClient = useQueryClient();
    const { user } = useContext(UserContext);
    const mutationKey: MutationKey = filesKey;

    return useMutation(createFile, {
        mutationKey: mutationKey,
        onMutate: async (variables : CreateFileProps) => {
            await queryClient.cancelQueries({queryKey: filesKey, exact: true});
                
            let files = queryClient.getQueryData<InfiniteData<FilesResult>>(filesKey);
            let file =  findAnyExistingItem<FileType>(files, "name", variables.blob.name, true) || variables.file;

            if (!file) {
                // If non existing add optimistic update
                const meta = queryClient.getQueryCache().find<FilesResult>(filesKey)!.meta;
                const order = meta!.order as FileOrder;

                let refId = Math.random();
                var srcUrl: URL | undefined;
                try {
                    srcUrl = variables.blob.thumbnail_url && new URL(variables.blob.thumbnail_url) || undefined;
                } catch(e) { /* no worries */}

                file = getTempFile(srcUrl, variables.blob.name, variables.blob.size, variables.blob.media_type, refId, user);
                addCacheItem(queryClient, filesKey, file, file.id, order);
            } else {
                updateCacheItem(queryClient, filesKey, file?.refId || file?.id, (file: FileType) => Object.assign(file, { status: "pending" }));
            }

            return <MutationFileContext>{ file: file, blob: variables.blob }
        },
        onSuccess: (data: FileType, variables: CreateFileProps, context: MutationFileContext | undefined) => {   
            updateCacheItem(queryClient, filesKey, context!.file?.refId || context!.file?.id, (file: FileType) => Object.assign(file, data, { status: "ok", statusText: undefined, progress: undefined }));
            setMutationContext(queryClient, mutationKey, variables, (context) => {
                context.file.progress = undefined;
                context.file.status = "ok";
                context.file.statusText = undefined;
            });
            queryClient.invalidateQueries({queryKey: filesKey});
        },
        onError(error: ServerErrorResponse, variables: CreateFileProps, context: MutationFileContext | undefined) {
            if (error && error.status === 409) {
                updateCacheItem(queryClient, filesKey, context!.file?.refId || context!.file?.id, (file: FileType) => Object.assign(file, { status: "conflict", statusText: error.detail || error.title, progress: undefined }));
                setMutationContext(queryClient, mutationKey, variables, (context) => {
                    context.file.progress = undefined;
                    context.file.status = "conflict";
                    context.file.statusText = error.detail || error.title;
                })
            } else {
                const errorId = context!.file?.refId || context!.file?.id;
                if (errorId) {
                    if (errorId >= 1) {
                        updateCacheItem(queryClient, filesKey, errorId, (file: FileType) => Object.assign(file, { status: "error", statusText: error.detail || error.title, progress: undefined }));
                    } else if (errorId > 0 && errorId < 1) {
                        removeCacheItem(queryClient, mutationKey, errorId);
                    }
                }
                setMutationContext(queryClient, mutationKey, variables, (context) => {
                    if (context) {
                        context.file.progress = undefined;
                        context.file.status = "error";
                        context.file.statusText = error.detail || error.title;
                    }
                })
            }
        },
    })
}