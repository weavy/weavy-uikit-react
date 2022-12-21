import React, { useEffect, useCallback, useContext } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import useEvents from '../hooks/useEvents';
import usePostsList from '../hooks/usePostsList';
import Post from './Post';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import PostPlaceHolder from './PostPlaceholder';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

type Props = {
    appId: number
}

const PostList = ({ appId }: Props) => {

    const { client } = useContext(WeavyContext);
    const { dispatch } = useEvents();

    const infintePostsList = usePostsList(appId, {})
    const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage, dataUpdatedAt } = infintePostsList;

    const loadMoreRef = useInfiniteScroll(infintePostsList)

    useEffect(() => {
        if (appId) {
            client?.subscribe(`a${appId}`, "reaction_added", handleRealtimeReactionInserted);
            client?.subscribe(`a${appId}`, "reaction_removed", handleRealtimeReactionDeleted);
            // client?.subscribe(`a${appId}`, "comment_created", handleRealtimeComment);
        }
    }, [appId]);

    // const handleRealtimeComment = useCallback((realtimeEvent: RealtimeMessage) => {
    //     console.log("COMMENT CREATED!", realtimeEvent)
    // }, [appId])

    const handleRealtimeReactionInserted = useCallback((realtimeEvent: RealtimeReaction) => {
        dispatch("reaction_added_" + realtimeEvent.entity.id, realtimeEvent);
    }, [appId]);

    const handleRealtimeReactionDeleted = useCallback((realtimeEvent: RealtimeReaction) => {
        dispatch("reaction_deleted_" + realtimeEvent.entity.id, realtimeEvent);
    }, [appId]);

    let loadMoreButton = <Button.UI onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="wy-message-readmore">{dataUpdatedAt} Load more</Button.UI>;

    if (isLoading) {
        return <div className='wy-buttons'><Spinner.UI /></div>
    }

    return (
        <div>
            {data && data.pages && data.pages.map((group, i) => {
                return <React.Fragment key={data.pages.length - i}>
                    {
                        group.data?.map((post: MessageType) => {
                            return post.temp ?
                                <PostPlaceHolder key={'post' + post.id} text={post.text} created_at={post.created_at} created_by={post.created_by} /> :
                                <Post
                                    key={'post' + post.id}
                                    appId={appId}
                                    id={post.id}
                                    text={post.text}
                                    html={post.html}
                                    created_at={post.created_at}
                                    modified_at={post.modified_at}
                                    created_by={post.created_by}
                                    trashed_at={post.trashed_at}
                                    attachments={post.attachments}
                                    reactions={post.reactions}
                                    embed={post.embed}
                                    comment_count={post.comment_count}
                                    is_subscribed={post.is_subscribed}
                                    is_trashed={post.is_trashed}
                                    options={post.options}
                                    meeting={post.meeting}
                                />
                        })
                    }
                </React.Fragment>
            })}
            <div className="wy-message-readmore" ref={loadMoreRef}>
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? loadMoreButton
                            : ""}
            </div>
        </div>


    )
}

export default PostList;