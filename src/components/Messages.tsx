import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import useMessages from '../hooks/useMessages';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Message from './Message';
import { scrollParentToBottom, isParentAtBottom } from "../utils/scroll-position";
import { useReverseInfiniteScroll } from '../hooks/useInfiniteScroll';
import dayjs from 'dayjs';
import useEvents from '../hooks/useEvents';
import useMutateRead from '../hooks/useMutateRead';
import useMutateMessage from '../hooks/useMutateMessage';
import { useQueryClient } from 'react-query';
import { WeavyContext } from '../contexts/WeavyContext';
import Avatar from './Avatar';
import Editor from './Editor';
import { AppFeatures, BlobType, FileType, MembersResult, MessageType, PollOptionType, RealtimeMessage, RealtimeReaction } from '../types/types';
import { Feature, hasFeature } from '../utils/featureUtils';

type Props = {
    id: number,
    members: MembersResult | undefined,
    displayName?: string,
    avatarUrl?: string,
    lastMessageId: number | null,
    chatRoom: boolean,
    features: string[],
    appFeatures: AppFeatures | undefined
}

const Messages = ({ id, members, displayName, avatarUrl, lastMessageId, chatRoom, features, appFeatures }: Props) => {
    const [, onNextRender] = useState<any>();

    const { user } = useContext(UserContext);

    const queryClient = useQueryClient();
    const { client } = useContext(WeavyContext);
    const messagesEndRef = useRef<any>();

    const { dispatch, on, events } = useEvents();

    const infiniteMessages = useMessages(id, {});
    const { isLoading, isError, data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = infiniteMessages;

    const readMessageMutation = useMutateRead();
    const addMessageMutation = useMutateMessage();

    // scroll to bottom when data changes
    useLayoutEffect(() => {
        //if (id && !isLoading && !isLoadingMembers && !isLoadingConversation) {
        if (id && !isLoading) {
            // scroll to bottom when selecting a conversation
            scrollParentToBottom(messagesEndRef.current);

            // Scroll to bottom again two frames later, because the height is changing
            onNextRender(() => requestAnimationFrame(() => scrollParentToBottom(messagesEndRef.current)));
        }
    }, [id, isLoading]);

    const readMoreRef = useReverseInfiniteScroll(infiniteMessages, [id]);

    // useEffect(() => {
    //         console.log("Data chagned")
    //         onNextRender(() => requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true)));
        
    // }, [data?.pages.reverse()[0].data]);

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

    const scrollCallback = () => {        
        onNextRender(() => requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true)));
    }

    const handleCreate = async (text: string, blobs: BlobType[], attachments: FileType[], meeting: number | null, embed: number | null, options: PollOptionType[]) => {
        if (id) {            
            await addMessageMutation.mutateAsync({ id: id, text: text, blobs: blobs, meeting: meeting, userId: user.id, callback: scrollCallback }, {                
                onSuccess: (data: MessageType) => {                    
                    onNextRender(() => requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true)));

                    // mark conversation as read
                    readMessageMutation.mutate({ id: id, read: true, messageId: data.id }, {
                        onSettled: () => onNextRender(() => requestAnimationFrame(() => requestAnimationFrame(() => scrollParentToBottom(messagesEndRef.current, true))))
                    });

                }
            });            
        }
    }

    const handleRealtimeSeenBy = async (data: any) => {
        let isAtBottom = isParentAtBottom(readMoreRef.current);
        // how to do this better?                
        queryClient.invalidateQueries(["members", id]);

        if (isAtBottom) {
            onNextRender(() => requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true)));
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
                onNextRender(() => requestAnimationFrame(() => scrollParentToBottom(readMoreRef.current, true)));
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
            <div className="wy-pager" ref={readMoreRef}>
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                        ? loadMoreButton
                        : messageHeader}

            </div>
            {data && members && data.pages && data.pages.map((group, i) => {
                let lastDate: dayjs.Dayjs;
                // Reverse key since page loading is reversed
                return <React.Fragment key={data.pages.length - i}>
                    {
                        group.data?.map((item: MessageType) => {

                            const date = dayjs.utc(item.created_at).tz(dayjs.tz.guess());
                            let dateContent = <></>;

                            if(lastDate?.format('YYMMDD') !== date.format('YYMMDD')){
                                lastDate = date;
                                dateContent = <div className="wy-date-separator"><time>{date.format("L")}</time></div>
                            }

                            const message = <Message  
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
                                options={item.options}
                                appId={id}
                                reactions={item.reactions}
                                chatRoom={chatRoom}
                                features={features}
                                appFeatures={appFeatures}
                                //reactions_count={item.reactions_count}
                                seenBy={(members.data && members.data.length > 0) ? members.data.filter((member) => {
                                    return member.marked_id === item.id && member.id !== user.id;
                                }) : []}
                            />;

                            return <React.Fragment key={item.id}>{dateContent}{message}</React.Fragment>;
                        })
                    }
                </React.Fragment>
            })}
            <div ref={messagesEndRef} />
        </>
    );

    if (isLoading) {
        messages = (
            <Spinner.UI overlay={true} />
        )
    }


    return (
        <>
            <div id="container" className="wy-messages" >
                {messages}
            </div>
            <div className="wy-footerbar wy-footerbar-sticky">
                <Editor 
                    key={id} 
                    appId={id} 
                    placeholder="Type a message" 
                    buttonText="" 
                    editorType="messages" 
                    editorLocation='apps' 
                    onSubmit={handleCreate} 
                    showMention={hasFeature(features, Feature.Mentions, appFeatures?.mentions)} 
                    showAttachments={hasFeature(features, Feature.Attachments, appFeatures?.attachments)} 
                    showCloudFiles={hasFeature(features, Feature.CloudFiles, appFeatures?.cloudFiles)} 
                    showMeetings={hasFeature(features, Feature.Meetings, appFeatures?.meetings)} 
                    showTyping={hasFeature(features, Feature.Typing, appFeatures?.typing)} 
                    useDraft={true} />
            </div>
        </>

    );
}

export default Messages;