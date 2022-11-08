import React, { useCallback, useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import { MessengerContext } from '../contexts/MessengerContext';
import { WeavyContext } from '../contexts/WeavyContext';
import useMutatePinned from '../hooks/useMutatePinned';
import useMutateRead from '../hooks/useMutateRead';
import { ConversationListItemProps } from '../types/ConversationListItem';
import Dropdown from '../ui/Dropdown';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Typing from './Typing';
import useMutateRemoveMembers from '../hooks/useMutateRemoveMembers';
import Avatar from './Avatar';
import { UserContext } from '../contexts/UserContext';
import classNames from 'classnames';

const ConversationListItem = ({ item, refetchConversations }: ConversationListItemProps) => {

    const { client } = useContext(WeavyContext);
    const { setSelectedConversationId, selectedConversationId } = useContext(MessengerContext);
    const { user } = useContext(UserContext);
    const readMutation = useMutateRead();
    const pinMutation = useMutatePinned();
    const removeMembers = useMutateRemoveMembers();
    const date = dayjs.utc(item.last_message?.created_at).tz(dayjs.tz.guess());

    
    // extract and keep all emojis
    const emojiHtml = item.last_message?.html || '';
    const emojiRegexp = /<img[^>]+wy-emoji.+>/g;
    const emojiShortcodeRegexp = /title=\"(:[^:\s]+:)\"/;
    const messageEmojis: { [index: string]: string } = {};

    emojiHtml.match(emojiRegexp)?.forEach((imgEmoji) => {
        let shortCode = imgEmoji.match(emojiShortcodeRegexp)![1];

        if (shortCode) {
            messageEmojis[shortCode] = imgEmoji;
        }
    });

    // replace text shortcodes with extracted emojis
    const shortCodeRegexp = /:[^:\s]*(?:::[^:\s]*)*:/gi;
    const itemSnippet = (item.last_message?.text || '').replace(shortCodeRegexp, (shortCode) => messageEmojis[shortCode]);
    

    const ChatRoom = "edb400ac-839b-45a7-b2a8-6a01820d1c44";

    const handleClick = (e: React.MouseEvent<HTMLDivElement>, id: any) => {
        if (!e.defaultPrevented) {
            e.preventDefault();
            setSelectedConversationId(id);
        }
    }

    const handleAppUpdated = useCallback((realtimeEvent: RealtimeApp) => {   
        if (realtimeEvent.app.id !== item.id) return;
        refetchConversations();

    }, [item.id]);

    const handleMessageCreated = useCallback((realtimeEvent: RealtimeMessage) => {   
        if (realtimeEvent.message.app_id !== item.id) return;
        refetchConversations();

    }, [item.id]);

    const handleMemberAdded = useCallback((realtimeEvent: RealtimeMember) => {   
        if (realtimeEvent.app.id !== item.id) return;
        refetchConversations();

    }, [item.id]);

    useEffect(() => {
        client?.subscribe(`a${item.id}`, "app_updated", handleAppUpdated);
        client?.subscribe(`a${item.id}`, "message_created", handleMessageCreated);
        client?.subscribe(`a${item.id}`, "member_added", handleMemberAdded);

        return () => {
            client?.unsubscribe(`a${item.id}`, "app_updated", handleAppUpdated);
            client?.unsubscribe(`a${item.id}`, "message_created", handleMessageCreated);
            client?.unsubscribe(`a${item.id}`, "member_added", handleMemberAdded);
        }
    }, [item.id])

    const otherId = item.type !== ChatRoom ? item.member_ids.find((i) => { return i != user.id }) : null;

    const handleUnread = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        readMutation.mutate({ id: item.id, read: false, messageId: null });
    }

    const handleRead = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        readMutation.mutate({ id: item.id, read: true, messageId: item.last_message.id });
    }

    const handlePin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        pinMutation.mutate({ id: item.id, pin: true });
    }

    const handleUnpin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        pinMutation.mutate({ id: item.id, pin: false });
    }

    const handleLeaveConversation = () => {
        removeMembers.mutate({ id: item.id, members: [user.id] });
    }

    // const handleStar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    //     e.preventDefault();
    //     console.log("Star: ", item.id)
    // }

    return (
        <div className={classNames('wy-item wy-item-lg wy-item-hover wy-conversation', {"wy-unread": item.is_unread, "wy-active": selectedConversationId === item.id})} key={item.id} onClick={(e) => handleClick(e, item.id)}>
            <Avatar src={item.avatar_url} id={otherId || -1} presence={item.type !== ChatRoom ? "away" : ""} name={item.display_name} />

            <div className="wy-item-body">
                <div className="wy-item-row">
                    <div className="wy-item-title">{item.display_name}</div>
                    {item.last_message &&
                        <time className="wy-meta" dateTime={item.last_message.created_at.toString()} title={date.format('LLLL')}>{date.fromNow()}</time>
                    }
                </div>
                <div className="wy-item-row">
                    <div className="wy-item-text">
                        <Typing id={item.id} context="listitem">

                            {itemSnippet &&
                                <span className="wy-typing-hide" dangerouslySetInnerHTML={{ __html: itemSnippet }}></span>
                            }
                            {!itemSnippet &&
                                <span className="wy-typing-hide">
                                    {item.last_message?.attachment_ids?.length > 0 &&
                                        <Icon.UI name="attachment" size={1} />
                                    }
                                    {item.last_message?.meeting_id &&
                                        <Icon.UI name="zoom" size={1} />
                                    }
                                </span>
                            }

                        </Typing>
                    </div>
                    

                </div>
            </div>
            <div className="wy-item-actions wy-item-actions-bottom">
                        {item.is_pinned &&
                            <Button.UI onClick={handleUnpin}>
                                <Icon.UI name="pin" size={1/1.5} />
                            </Button.UI>

                        }

                        <Dropdown.UI directionX='left'>
                            <>
                                {item.is_unread &&
                                    <Dropdown.Item onClick={handleRead}>Mark as read</Dropdown.Item>
                                }
                                {!item.is_unread &&
                                    <Dropdown.Item onClick={handleUnread}>Mark as unread</Dropdown.Item>
                                }
                            </>
                            <>
                                {item.is_pinned &&
                                    <Dropdown.Item onClick={handleUnpin}>Unpin</Dropdown.Item>
                                }
                                {!item.is_pinned &&
                                    <Dropdown.Item onClick={handlePin}>Pin</Dropdown.Item>
                                }
                            </>
                            {item.type === ChatRoom &&
                                <Dropdown.Item onClick={handleLeaveConversation}>Leave conversation</Dropdown.Item>
                            }

                            {/* <li><Button.UI onClick={handleStar}>Star</Button.UI></li> */}
                        </Dropdown.UI>

                    </div>
        </div>
    )
}

export default ConversationListItem;