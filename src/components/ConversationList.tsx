import React, { useState, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import useConversations from '../hooks/useConversations';
import ConversationListItem from './ConversationListItem';
import NewConversation from './NewConversation';
import Avatar from './Avatar';
import { UserContext } from '../contexts/UserContext';
import Button from '../ui/Button';
import { createScroller } from "../utils/infiniteScroll";

const ConversationList = () => {
    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);
    const { data, isLoading, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversations({});
    const loadMoreRef = useRef<any>();
    const [resolveScrollerFetch, setResolveScrollerFetch] = useState<Function | null>()
    let scroller: IntersectionObserver | null;

    if (!client) {
        throw new Error('Weavy ConversationList component must be used within an WeavyProvider');
    }


    useLayoutEffect(() => {
        if(!isLoading){
            scroller?.disconnect();

            scroller = createScroller(loadMoreRef.current, () => {
                if (hasNextPage) {
                    return fetchNextPage().then(() => {
                        // Wait for useLayoutEffect before resolving
                        return new Promise((resolve: Function) => setResolveScrollerFetch(resolve))
                    })
                }
            })
        }

        return () => {
            scroller?.disconnect();
            scroller = null;
        }
       
    }, [isLoading]);

    useLayoutEffect(() => {
        // Resolve fetchNextPage after layout has been painted
        if (!isFetchingNextPage && resolveScrollerFetch) {
            resolveScrollerFetch()
            setResolveScrollerFetch(null);
        }
    }, [data]);

    useEffect(() => {

        client.subscribe(null, "app_created", handleAppInserted);
        client.subscribe(null, "member_added", handleAppInserted);

        return () => {
            client.unsubscribe(null, "app_created", handleAppInserted);
            client.unsubscribe(null, "member_added", handleAppInserted);
        }
    }, []);

    const handleAppInserted = (data: ConversationType) => {
        refetch();
    }


    if (isLoading) {
        return (
            <div>Loading Conversation list...</div>
        )
    }

    let loadMoreButton = <Button.UI onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="wy-message-readmore">Load more</Button.UI>;

    return (
        <>
            <header className="wy-appbars" data-adjust-scrollbar-top>
                <nav className="wy-appbar">
                    <Avatar src={user.avatar_url} name={user.display_name} presence={user.presence} id={user.id} size={24} />
                    <div>Messenger</div>
                    <NewConversation />
                </nav>
            </header>
            <div className="wy-conversations">
                {data && data.pages && data.pages.map((group, i) => {
                    return group.data?.map((item) => {
                        return < ConversationListItem key={item.id} refetchConversations={refetch} item={item} />
                    })

                }

                )}
                <div className="wy-message-readmore" ref={loadMoreRef}>
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? loadMoreButton
                            : ""}

                </div>                
            </div>
        </>
    )
}

export default ConversationList;