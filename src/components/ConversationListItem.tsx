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
import Avatar from './Avatar';
import { UserContext } from '../contexts/UserContext';
import classNames from "classnames";
import useMutateStarred from '../hooks/useMutateStarred';
import useMutateLeaveConversation from '../hooks/useMutateLeaveConversation';
import { RealtimeApp, RealtimeMember, RealtimeMessage } from '../types/types';

const ConversationListItem = ({ item, userId, refetchConversations }: ConversationListItemProps) => {

    const { client } = useContext(WeavyContext);
    const { setSelectedConversationId, selectedConversationId } = useContext(MessengerContext);
    const { user } = useContext(UserContext);
    const readMutation = useMutateRead();
    const pinMutation = useMutatePinned();
    const starMutation = useMutateStarred();    
    const leaveConversation = useMutateLeaveConversation();
    const date = dayjs.utc(item.last_message?.created_at).tz(dayjs.tz.guess());


    // extract and keep all emojis
    // const emojiHtml = item.last_message?.html || '';
    // const emojiRegexp = /<img[^>]+wy-emoji.+\/>/g;
    // const emojiShortcodeRegexp = /title=\"(:[^:\s]+:)\"/;
    // const messageEmojis: { [index: string]: string } = {};

    // emojiHtml.match(emojiRegexp)?.forEach((imgEmoji) => {
    //     let shortCode = imgEmoji.match(emojiShortcodeRegexp)![1];

    //     if (shortCode) {
    //         messageEmojis[shortCode] = imgEmoji;
    //     }
    // });
    
    // replace text shortcodes with extracted emojis
    //const shortCodeRegexp = /:[^:\s]*(?:::[^:\s]*)*:/gi;
    //const itemSnippet = (item.last_message?.text || '').replace(shortCodeRegexp, (shortCode) => messageEmojis[shortCode]);


    // extract and keep all emojis
    const emojiHtml = item.last_message?.html || '';
    const emojiRegexp = /<img[^>]+wy-emoji[^>]+>/g;
    const emojiUnicodeRegexp = /alt=\"([^\"]+)\"/;
    const messageUnicodeEmojis: { [index: string]: string } = {};

    emojiHtml.match(emojiRegexp)?.forEach((imgEmoji: any) => {
        let uniCode = imgEmoji.match(emojiUnicodeRegexp)![1];

        if (uniCode) {
            messageUnicodeEmojis[uniCode] = imgEmoji;
        }
    });
    
    var emojiMessageText = item.last_message?.plain || '';

    // replace text unicode emojis with extracted emojis
    for (let emoji in messageUnicodeEmojis) {
        emojiMessageText = emojiMessageText.replace(emoji, messageUnicodeEmojis[emoji]);
    }

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
    }, [item.id]);

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
        leaveConversation.mutate({ id: item.id, members: [user.id] });
    }

    const handleStar = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        starMutation.mutate({ id: item.id, star: true });
    }

    const handleUnstar = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        starMutation.mutate({ id: item.id, star: false });
    }

    return (
        <div className={classNames('wy-item wy-item-lg wy-item-hover wy-conversation', { "wy-unread": item.is_unread, "wy-active": selectedConversationId === item.id })} key={item.id} onClick={(e) => handleClick(e, item.id)}>
            <Avatar src={item.avatar_url} id={item.user_id || -1} presence={item.type !== ChatRoom ? "away" : ""} name={item.display_name} />

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

                            {/* {itemSnippet &&
                                <span className="wy-typing-hide" dangerouslySetInnerHTML={{ __html: itemSnippet }}></span>
                            } */}
                            {/* {!itemSnippet && */}
                            <span className="wy-typing-hide">

                                {item.last_message &&
                                    <>
                                        {userId === item.last_message?.created_by.id &&
                                            <>You: </>
                                        }
                                        {(item.member_count || 0) > 2 && userId !== item.last_message?.created_by.id &&
                                            <>{item.last_message?.created_by.display_name}: </>
                                        }
                                    </>
                                }

                                {item.last_message?.text &&
                                    <span dangerouslySetInnerHTML={{ __html: emojiMessageText}}></span>
                                }
                                {!item.last_message?.text && (item.last_message?.attachment_count || 0) > 0 &&
                                    <Icon.UI name="attachment" />
                                }
                                {!item.last_message?.text && item.last_message?.meeting_id &&
                                    <Icon.UI name="zoom" />
                                }
                                {!item.last_message &&
                                    <>&nbsp;</>
                                }
                            </span>
                            {/* } */}

                        </Typing>
                    </div>


                </div>
            </div>
            <div className="wy-item-actions wy-item-actions-bottom">
                {item.is_starred &&
                    <Button.UI onClick={handleUnstar}>
                        <Icon.UI name="star" size={24} className='wy-icon-yellow'/>
                    </Button.UI>

                }

                <Dropdown.UI directionX='left' icon={item.is_pinned ? "pin": undefined}>
                    <>
                        {item.is_unread &&
                            <Dropdown.Item onClick={handleRead}>
                                <Icon.UI name="unread" />
                                Mark as read
                            </Dropdown.Item>
                        }
                        {!item.is_unread &&
                            <Dropdown.Item onClick={handleUnread}>
                                <Icon.UI name="read" />
                                Mark as unread
                            </Dropdown.Item>
                        }
                    </>
                    <>
                        {item.is_pinned &&
                            <Dropdown.Item onClick={handleUnpin}>
                                <Icon.UI name="unpin" />
                                Unpin
                            </Dropdown.Item>
                        }
                        {!item.is_pinned &&
                            <Dropdown.Item onClick={handlePin}>
                                <Icon.UI name="pin" />
                                Pin
                            </Dropdown.Item>
                        }
                    </>
                    <>
                        {item.is_starred &&
                            <Dropdown.Item onClick={handleUnstar}>
                                <Icon.UI name="unstar" />
                                Unstar
                            </Dropdown.Item>
                        }
                        {!item.is_starred &&
                            <Dropdown.Item onClick={handleStar}>
                                <Icon.UI name="star" />
                                Star
                            </Dropdown.Item>
                        }
                    </>
                    {item.type === ChatRoom &&
                        <Dropdown.Item onClick={handleLeaveConversation}>
                            <Icon.UI name="account-minus" />
                            Leave conversation
                        </Dropdown.Item>
                    }                    
                </Dropdown.UI>

            </div>
        </div>
    )
}

export default ConversationListItem;