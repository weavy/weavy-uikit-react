import React, { useContext, useEffect } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import useConversations from '../hooks/useConversations';
import ConversationListItem from './ConversationListItem';
import NewConversation from './NewConversation';
import Avatar from './Avatar';
import { UserContext } from '../contexts/UserContext';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import useInfinteScroll from '../hooks/useInfiniteScroll';
import { ConversationType } from '../types/types';

const ConversationList = () => {
    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);

    if (!client) {
        throw new Error('Weavy ConversationList component must be used within an WeavyProvider');
    }

    const infinteConversations = useConversations({});
    const { data, isLoading, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = infinteConversations;

    const loadMoreRef = useInfinteScroll(infinteConversations);


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
                {isLoading &&
                    <Spinner.UI overlay={true} />
                }

                {data && data.pages && data.pages.map((group, i) => {
                    return group.data?.map((item: ConversationType) => {
                        return <ConversationListItem key={item.id} refetchConversations={refetch} item={item} userId={user.id} />
                    })

                }

                )}
                <div className="wy-pager" ref={loadMoreRef}>
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