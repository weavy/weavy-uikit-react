import { InfiniteData, QueryClient, QueryKey } from "react-query";

// export const getCacheItem = <T>(queryClient: QueryClient, key: QueryKey, id: number): T | null => {

//     const data = queryClient.getQueryData<any>(key);
//     if (data) {
//         if (data.pages) {
//             const items = data.pages.map((p: any) => p.data).flat();
//             return items.find((i: any) => i.id === id)
//         } else {
//             // not paged data...
//         }
//     }

//     return null;
// }

export function findAnyExistingItem<TDataItem>(queryData: InfiniteData<any> | undefined, propertyName:string, value: string, copy = false) {
    var existingItem: TDataItem | undefined;
    // Find any existing item with same property value
    if (queryData && queryData.pages) {
        queryData.pages.some((page: any) => {
            return page.data?.some((item: any) => {
                if (item[propertyName] === value) {
                    existingItem = item;
                    return true;
                }
            })
        })
    }

    return existingItem && copy ? <TDataItem>JSON.parse(JSON.stringify(existingItem)) : existingItem;
}

export function addToQueryData(queryData: any, item: any, sorting: { by?: string, descending?: boolean } = { }, tempId?: number) {
    if (queryData) {
        if (queryData.pages) {
            var foundIndex = -1;

            const newPagesArray = queryData.pages.map((page: any, i: number) => {
                if (foundIndex >= 0) {
                    return page;
                }
                
                var pageData = page.data as any[] || [];
                    
                // remove any previous item or tempId
                pageData = pageData.filter((pageItem: any) => pageItem.id !== item.id && (!tempId || pageItem.id !== tempId));

                if (sorting && sorting.by) {
                    // Use sorting
                    foundIndex = pageData.findIndex((pageItem: any) => {
                        var pageItemValue = pageItem[sorting.by!];
                        var itemValue =  item[sorting.by!];

                        // modified_at should fallback to created_at
                        if (sorting.by === "modified_at") {
                            pageItemValue ??= pageItem["created_at"];
                            itemValue ??= item["created_at"];
                        }

                        if (typeof pageItemValue === "string" && typeof itemValue === "string") {
                            let sortCompare = pageItemValue.localeCompare(itemValue, undefined, { sensitivity: "base", numeric: true });
                            return (sorting.descending ? sortCompare < 0 : sortCompare > 0);
                        }
    
                        return (sorting.descending ? pageItemValue < itemValue : pageItemValue > itemValue);
                    });
                    

                    if (foundIndex >= 0) {
                        pageData.splice(foundIndex, 0, item);
                        page.data = [...pageData];
                    } else if (i == queryData.pages.length - 1 && page.end === page.count) {
                        // end of the list
                        page.data = [...pageData, item];
                    } else {
                        page.data = [...pageData];
                    }
                } else {
                    // add new item to first page
                    if (i === 0) {
                        if (sorting.descending){
                            page.data = [                            
                                item,
                                ...pageData                         
                            ]
                        } else {
                            page.data = [                            
                                ...pageData,
                                item
                            ]
                        }
                    }
                }

                return page;

            }) ?? [];

            return {
                pages: newPagesArray,
                pageParams: queryData.pageParams,
            }
        } else if (queryData.length) {
            // not paged data...
            var foundIndex = -1;
            // remove any previous item or tempId
            var newData = [...queryData.filter((dataItem: any) => dataItem.id !== item.id && (!tempId || dataItem.id !== tempId))];

            if (sorting && sorting.by) {
                // Use sorting
                foundIndex = newData.findIndex((dataItem: any) => {
                    var dataItemValue = dataItem[sorting.by!];
                    var itemValue =  item[sorting.by!];

                    // modified_at should fallback to created_at
                    if (sorting.by === "modified_at") {
                        dataItemValue ??= dataItem["created_at"];
                        itemValue ??= item["created_at"];
                    }

                    if (typeof dataItemValue === "string" && typeof itemValue === "string") {
                        let sortCompare = dataItemValue.localeCompare(itemValue, undefined, { sensitivity: "base", numeric: true });
                        return (sorting.descending ? sortCompare < 0 : sortCompare > 0);
                    }

                    return (sorting.descending ? dataItemValue < itemValue : dataItemValue > itemValue);
                });
                

                if (foundIndex >= 0) {
                    newData.splice(foundIndex, 0, item);
                } else {
                    // end of the list
                    newData.push(item);
                }
            } else {
                // no specific sorting
                if (sorting.descending){
                    newData.unshift(item)
                } else {
                    newData.push(item);
                }
            }
            return newData;
        }
    }
    return queryData;
}

export function updateQueryData (queryData: any, select: number|((item: any) => boolean), fnUpdater: Function) {
    if (select !== undefined) {
        const predicate = select instanceof Function ? select : (item: any) => item.id === select;

        if (queryData) {
            if (queryData.pages) {
                
                const newPagesArray = queryData.pages.map((page: any, i: number) => {
                    // update item
                    page.data = [...page.data.map((item: any) => {
                        if (predicate(item)) {
                            item = JSON.parse(JSON.stringify(item)); // Immutable copy
                            fnUpdater(item)
                        }
                        return item;
                    })]
                    return page;
                }) ?? [];
                
                return {
                    pages: newPagesArray,
                    pageParams: queryData.pageParams,
                };
            } else if(queryData.length) {
                return [...queryData.map((item: any) => {
                    if (predicate(item)) {
                        item = JSON.parse(JSON.stringify(item)); // Immutable copy
                        fnUpdater(item)
                    }
                    return item;
                })]
            }
        }
    }
    return queryData;
}

export function removeQueryData(queryData: any, select: number|((item: any) => boolean)) {
    if (select !== undefined) {
        const predicate = select instanceof Function ? select : (item: any) => item.id === select;

        if (queryData) {
            if (queryData.pages) {
                const newPagesArray = queryData.pages.map((page: any, i: number) => {
                    // update item
                    page.data = [...page.data.filter((item: any) => !predicate(item))]
                    return page;
                }) ?? [];

                return {
                    pages: newPagesArray,
                    pageParams: queryData.pageParams,
                };
            } else if(queryData.length) {
                return [...queryData.filter((item: any) => !predicate(item))];
            }
        }
    }
    return queryData;
}



export const addCacheItem = <T>(queryClient: QueryClient, key: QueryKey, item: any, tempId?: number, sorting?: { by?: string, descending?: boolean }): T | void => {
    queryClient.setQueryData(key, (data: any) => addToQueryData(data, item, sorting, tempId));
}


export const updateCacheItem = <T>(queryClient: QueryClient, key: QueryKey, select: number|((item: any) => boolean), fnUpdater: Function): T | void => {
    queryClient.setQueryData(key, (data: any) => updateQueryData(data, select, fnUpdater))
}

export const removeCacheItem = <T>(queryClient: QueryClient, key: QueryKey, select: number|((item: any) => boolean)): T | void => {
    queryClient.setQueryData(key, (data: any) => removeQueryData(data, select));
}

// export const setCacheItem = (queryClient: QueryClient, key: QueryKey, id: number, updated: any) => {
//     const data = queryClient.getQueryData<any>(key);
//     if (data) {
//         if (data.pages) {
//             const newPagesArray = data.pages.map((page: any, i: number) => {
//                 // update entity
//                 page.data = [...page.data.map((item: any) => item.id === id ? updated : item)]
//                 return page;
//             }) ?? [];

//             queryClient.setQueryData(key, (data: any) => ({
//                 pages: newPagesArray,
//                 pageParams: data.pageParams,
//             }));
//         } else {
//             // not paged data...
//         }
//     }
// }