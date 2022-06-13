import React, { useContext, useEffect, useState } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import { ChatProps } from '../types/Chat';
import useChat from '../hooks/useChat';
import Messages from './Messages';
import useMembers from '../hooks/useMembers';
import Typing from './Typing';
import useConversation from '../hooks/useConversation';
import { prefix as wy } from "../utils/styles";

const Chat = ({ id }: ChatProps) => {
    const { client } = useContext(WeavyContext);
    const [selectedId, setSelectedId] = useState<number | null>(null)

    if (!client) {
        throw new Error('Weavy Chat component must be used within an WeavyProvider');
    }

    const { isLoading: isLoadingChat, data: dataChat } = useChat(id, {});

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
        <>
            <header className={wy('appbars')}>
                <nav className={wy('appbar')}>

                    {selectedId && dataConversation &&

                        <>
                            <div>
                                <Typing id={selectedId} context="conversation">
                                    {dataConversation.display_name}
                                </Typing>
                            </div>
                        </>
                    }
                </nav>
            </header>

            {!isLoadingChat && !dataChat &&
                <div>No chat with the contextual id <strong>{id}</strong></div>
            }

            {selectedId && dataMembers &&
                <Messages id={selectedId} members={dataMembers} />
            }
        </>
    )
}

export default Chat;