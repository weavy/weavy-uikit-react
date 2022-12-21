import { useState, useLayoutEffect, useRef } from "react";
import { UseInfiniteQueryResult } from "react-query/types/react/types";
import { createScroller, createReverseScroller } from "../utils/infinite-scroll";

export default function useInfinteScroll(infiniteQuery: UseInfiniteQueryResult, deps: React.DependencyList = [], reverse: boolean = false) {
    const loadMoreRef = useRef<any>();
    const [resolveScrollerFetch, setResolveScrollerFetch] = useState<Function | undefined>()
    
    useLayoutEffect(() => {
        if(!infiniteQuery.isLoading){
            var scroller: IntersectionObserver | undefined;

            requestAnimationFrame(() => {
                scroller = createScroller(loadMoreRef.current, () => {
                    if (infiniteQuery.hasNextPage || infiniteQuery.isFetching) {
                        //console.log("infinite scroll fetch"); 

                        return infiniteQuery.fetchNextPage({ cancelRefetch: false }).then(() => {
                            // Wait for effects and trigger render before resolving
                            if (reverse) {
                                return new Promise((resolve: Function) => { setResolveScrollerFetch(() => {
                                    //console.log("infinite scroll fetch resolved"); 
                                    resolve()
                                })})
                            }
                        })
                    }
                }, reverse)
            })

            return () => {
                //console.log("infinite scroll disconnect");
                scroller?.disconnect();
            }
        }
        
       
    }, [infiniteQuery.isLoading, infiniteQuery.dataUpdatedAt, ...deps]);

    return loadMoreRef;
}

export function useReverseInfiniteScroll(infiniteQuery: UseInfiniteQueryResult, deps: React.DependencyList = []) { 
    return useInfinteScroll(infiniteQuery, deps, true);
}