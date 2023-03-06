import React, { useContext, useEffect, useState } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import { ChatProps } from '../types/Chat';
import useChat from '../hooks/useChat';
import Messages from './Messages';
import useMembers from '../hooks/useMembers';
import Typing from './Typing';
import useConversation from '../hooks/useConversation';
import classNames from "classnames";

const Chat = ({ uid, className }: ChatProps) => {
    const { client } = useContext(WeavyContext);
    const [selectedId, setSelectedId] = useState<number | null>(null)

    if (!client) {
        throw new Error('Weavy Chat component must be used within an WeavyProvider');
    }

    const { isLoading: isLoadingChat, data: dataChat } = useChat(uid, {});

    const { isLoading: isLoadingMembers, data: dataMembers } = useMembers(selectedId, {
        // The query will not execute until the activeConversation exists
        enabled: selectedId != null
    });

    const { isLoading: isLoadingConversation, data: dataConversation } = useConversation(selectedId, {
        // The query will not execute until the activeConversation exists
        enabled: selectedId != null
    });

    useEffect(() => {
        if (dataChat) {            
            setSelectedId(dataChat.id);
        } else {
            setSelectedId(null);
        }
    }, [dataChat]);

    return (
        <div className={classNames("wy-messenger-conversation wy-scroll-y", className)}>
            <header className="wy-appbars" data-adjust-scrollbar-top>
                <nav className="wy-appbar">
                    <div></div>
                    {selectedId && dataConversation &&
                        <div className="wy-appbar-text">
                            <Typing id={selectedId} context="conversation">
                                {dataConversation.display_name}
                            </Typing>
                        </div>
                    }
                </nav>
            </header>

            {!isLoadingChat && !dataChat &&
                <div>No chat with the contextual id <strong>{uid}</strong></div>
            }

            {selectedId && dataMembers && dataChat && dataConversation &&
                <Messages id={selectedId} chatRoom={true} members={dataMembers} lastMessageId={dataConversation.last_message?.id} />
            }
        </div>
    )
}

export default Chat;