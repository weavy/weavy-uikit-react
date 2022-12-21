import { useContext, useEffect } from "react";
import { Mutation, QueryFunctionContext, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, useQuery, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { addToQueryData, findAnyExistingItem, updateQueryData } from "../utils/cacheUtils";
import { FileMutation } from "./useMutateFile";

/// GET all posts in an app
export default function useFileList(appId: number | null, options: any = {}) {
    const PAGE_SIZE = 25;
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useFileList must be used within an WeavyProvider');
    }
    
    const queryClient = useQueryClient();

    const filesKey = ['files', appId];

    useEffect(() =>  {
        // Refetch data when meta changes
        queryClient.removeQueries({
            queryKey: filesKey,
            exact: true,
            predicate: (query) => {
                let mismatch = JSON.stringify(query.meta) !== JSON.stringify(options.meta);
                if (mismatch) {
                    //console.log("file query mismatch, removing query")
                }
                return mismatch;
            }
          })
    }, [options]);

    const updateDataWithMutations = (data: any) => {
        const mutatingFiles = queryClient.getMutationCache()
        .findAll({mutationKey: filesKey, predicate: (mutation: Mutation) => !!(<unknown>mutation as FileMutation).state.context?.file})
        .map((mutation: Mutation) => (<unknown>mutation as FileMutation).state.context!.file);
        
        const meta = queryClient.getQueryCache().find<FilesResult>(filesKey)?.meta;
        const order = meta?.order as FileOrder;
        
        mutatingFiles.forEach((file) => {
            //if (meta?.trashed === file.is_trashed) {
                if (file.id < 1 && file.status !== "ok" && file.status !== "error") {
                    let existingFile = findAnyExistingItem<FileType>(data, "name", file.name, true);
                    if (existingFile) {
                        file.id = existingFile.id;
                    }
                    data = addToQueryData(data, file, order);
                } else {
                    data = updateQueryData(data, file.id, (cacheFile: FileType) => { Object.assign(cacheFile, file)});
                }
            //}
        });
        return data;
    };

    const getFiles = async (opt: QueryFunctionContext) => {
        let skip = opt.pageParam || 0;
        let order: FileOrder | undefined = opt.meta && opt.meta.order as FileOrder;
        let trashed: boolean = !!opt.meta?.trashed;
        let orderParam = order ? order.by + (order.descending ? "+desc" : "") : "";
        let url = "/api/apps/" + appId + "/files?skip=" + skip + "&top=" + PAGE_SIZE + "&orderby=" + orderParam;
        if (trashed) {
            url += "&trashed=null";
        }

        const response = await client.get(url);
        return await response.json();        
    };
    var opts: Omit<UseInfiniteQueryOptions<FilesResult, unknown, FilesResult, FilesResult, QueryKey>, "queryKey" | "queryFn"> | undefined = {
        ...options, 
        getNextPageParam: (lastPage:any, pages:any) => { 
            if (lastPage?.end < lastPage?.count)  {                
                return pages.length * PAGE_SIZE;
            }
        },
        
        select: updateDataWithMutations
    };
        
    return useInfiniteQuery<FilesResult>(['files', appId], getFiles, opts)
}
