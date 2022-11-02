import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import useMessages from '../hooks/useMessages';
import Button from '../ui/Button';
import Message from './Message';
import { createReverseScroller } from "../utils/infiniteScroll";
import { scrollParentToBottom, isParentAtBottom } from "../utils/scrollToBottom";
import ConversationForm from './ConversationForm';
import useEvents from '../hooks/useEvents';
import useMutateRead from '../hooks/useMutateRead';
import useMutateMessage from '../hooks/useMutateMessage';
import { useQueryClient } from 'react-query';
import { WeavyContext } from '../contexts/WeavyContext';
import Avatar from './Avatar';

type Props = {
    id: number,
    members: MembersResult | undefined,
    displayName?: string,
    avatarUrl?: string,
    lastMessageId: number | null,
    chatRoom: boolean
}

const Messages = ({ id, members, displayName, avatarUrl, lastMessageId, chatRoom }: Props) => {
    var reverseScroller: IntersectionObserver | null;

    const { user } = useContext(UserContext);

    const queryClient = useQueryClient();
    const { client } = useContext(WeavyContext);

    const readMoreRef = useRef<any>();
    const messagesEndRef = useRef<any>();
    const [resolveScrollerFetch, setResolveScrollerFetch] = useState<Function | null>()

    const { dispatch, on, events } = useEvents();

    const { isLoading, isError, data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useMessages(id, {});


    const readMessageMutation = useMutateRead();
    const addMessageMutation = useMutateMessage();

    // scroll to bottom when data changes
    useLayoutEffect(() => {
        //if (id && !isLoading && !isLoadingMembers && !isLoadingConversation) {
        if (id && !isLoading) {
            // scroll to bottom when selecting a conversation
            scrollParentToBottom(messagesEndRef.current);

            // Scroll to bottom again two frames later, because the height is changing
            requestAnimationFrame(() => requestAnimationFrame(() => scrollParentToBottom(messagesEndRef.current)));

            // register infinite scroll

            reverseScroller?.disconnect();

            reverseScroller = createReverseScroller(readMoreRef.current, () => {
                if (hasNextPage) {
                    return fetchNextPage().then(() => {
                        // Wait for useLayoutEffect before resolving
                        return new Promise((resolve: Function) => setResolveScrollerFetch(resolve))
                    })
                }
            })

        } else {
            reverseScroller?.disconnect();
            reverseScroller = null;
        }

        return () => {
            reverseScroller?.disconnect();
            reverseScroller = null;
        }
    }, [id, isLoading]);


    useLayoutEffect(() => {
        // Resolve fetchNextPage after layout has been painted
        if (!isFetchingNextPage && resolveScrollerFetch) {
            resolveScrollerFetch()
            setResolveScrollerFetch(null);
        }
    }, [data]);

    useEffect(() => {
        // mark conversation as read
        if (id && lastMessageId) {
            readMessageMutation.mutate({ id: id, read: true, messageId: lastMessageId })
        }
    }, [id, lastMessageId])

    useEffect(() => {
        if (id) {
            client?.subscribe(`a${id}`, "message_created", handleRealtimeMessage);
            client?.subscribe(`a${id}`, "conversation_marked", handleRealtimeSeenBy);
            client?.subscribe(`a${id}`, "reaction_added", handleRealtimeReactionInserted);
            client?.subscribe(`a${id}`, "reaction_removed", handleRealtimeReactionDeleted);
        }

        return () => {

            //window.removeEventListener('focus', handleFocus, false);

            if (id) {
                // remove additional pages in cache. Only get first page
                let qd = queryClient.getQueryData(["messages", id]);

                if (qd) {

                    queryClient.setQueryData(["messages", id], (data: any) => ({
                        pages: data?.pages.slice(0, 1),
                        pageParams: [undefined]
                    }));
                }

                client?.unsubscribe(`a${id}`, "message_created", handleRealtimeMessage);
                client?.unsubscribe(`a${id}`, "conversation_marked", handleRealtimeSeenBy);
                client?.unsubscribe(`a${id}`, "reaction_added", handleRealtimeReactionInserted);
                client?.unsubscribe(`a${id}`, "reaction_removed", handleRealtimeReactionDeleted);
            }
        }
    }, [id]);


    const handleRealtimeReactionInserted = useCallback((realtimeEvent: RealtimeReaction) => {
        dispatch("reaction_added_" + realtimeEvent.entity.id, realtimeEvent);
    }, [id]);

    const handleRealtimeReactionDeleted = useCallback((realtimeEvent: RealtimeReaction) => {
        dispatch("reaction_deleted_" + realtimeEvent.entity.id, realtimeEvent);
    }, [id]);

    // handle new message from post form
    const handleNewMessage = (text: string, attachments: [], meetings: []) => {
        addMessageMutation.mutate({ id: id, text: text, userId: user.id, attachments: attachments, meetings: meetings }, {
            onSuccess: (data: MessageType) => {
                // mark conversation as read
                readMessageMutation.mutate({ id: id, read: true, messageId: data.id });

                requestAnimationFrame(() => scrollParentToBottom(messagesEndRef.current, true))
            }
        });

        requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true));
    }

    const handleRealtimeSeenBy = async (data: any) => {
        let isAtBottom = isParentAtBottom(readMoreRef.current);
        // how to do this better?                
        queryClient.invalidateQueries(["members", id]);

        if (isAtBottom) {
            requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true));
        }
    }

    // real time insert-message handler
    const handleRealtimeMessage = useCallback((realtimeEvent: RealtimeMessage) => {
        if (realtimeEvent.message.app_id !== id || realtimeEvent.message.created_by_id === user.id) return;

        // set created_by
        realtimeEvent.message.created_by = realtimeEvent.actor;

        // mark conversation as read
        readMessageMutation.mutate({ id: id, read: true, messageId: realtimeEvent.message.id })

        const previousData = queryClient.getQueryData<any>(['messages', id]);

        if (previousData && previousData.pages) {
            let isAtBottom = isParentAtBottom(readMoreRef.current);

            const newPagesArray = previousData.pages.map((page: any, i: number) => {
                // add realtime message                    

                if (i === 0) {
                    page.data = [
                        ...page.data,
                        realtimeEvent.message
                    ]
                }
                return page;

            }) ?? [];

            queryClient.setQueryData(["messages", id], (data: any) => ({
                pages: newPagesArray,
                pageParams: data.pageParams,
            }));

            if (isAtBottom) {
                requestAnimationFrame(() => requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true)));
            }
        }


    }, [id]);

    let messageHeader = <div className="wy-avatar-header">
        {avatarUrl && displayName && <Avatar src={avatarUrl} name={displayName} id={id} size={128} /> || ''}
        {displayName && <div className="wy-headline">{displayName}</div> || ''}
    </div>;

    let loadMoreButton = <Button.UI onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="wy-message-readmore">Load more</Button.UI>;

    let messages = (
        <>
            <div className="wy-message-readmore" ref={readMoreRef}>
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                        ? loadMoreButton
                        : messageHeader}

            </div>
            {data && members && data.pages && data.pages.map((group, i) => {
                // Reverse key since page loading is reversed
                return <React.Fragment key={data.pages.length - i}>
                    {
                        group.data?.map((item: MessageType) => {

                            return <Message
                                key={item.id}
                                id={item.id}
                                html={item.html}
                                temp={item.temp}
                                me={item.created_by.id === user.id}
                                avatar={item.created_by.avatar_url}
                                name={item.created_by.display_name}
                                created_at={item.created_at}
                                created_by={item.created_by.display_name}
                                attachments={item.attachments}
                                meeting={item.meeting}
                                parentId={id}
                                reactions={item.reactions}
                                chatRoom={chatRoom}
                                //reactions_count={item.reactions_count}
                                seenBy={(members.data && members.data.length > 0) ? members.data.filter((member) => {
                                    return member.marked_id === item.id && member.id !== user.id;
                                }) : []}
                            />
                        })
                    }
                </React.Fragment>
            })}
            <div ref={messagesEndRef} />
        </>
    );

    if (isLoading) {
        messages = (
            <div>Loading messages...</div>
        )
    }


    return (
        <>
            <div id="container" className="wy-messages">
                {messages}
            </div>
            <div className="wy-footerbar wy-footerbar-sticky wy-message-editor wy-message-editor-bottom">
                <ConversationForm key={id} conversationId={id} handleInsert={handleNewMessage} />
            </div>
        </>

    );
}

export default Messages;