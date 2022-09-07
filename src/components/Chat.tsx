import React, { useContext, useEffect, useState } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import { ChatProps } from '../types/Chat';
import useChat from '../hooks/useChat';
import Messages from './Messages';
import useMembers from '../hooks/useMembers';
import Typing from './Typing';
import useConversation from '../hooks/useConversation';

const Chat = ({ uid }: ChatProps) => {
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
        <div className="wy-messenger-conversation wy-scroll-y">
            <header className="wy-appbars">
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

            {selectedId && dataMembers &&
                <Messages id={selectedId} members={dataMembers} />
            }
        </div>
    )
}

export default Chat;