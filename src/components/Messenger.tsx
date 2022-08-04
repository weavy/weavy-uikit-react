import React, { FC, useContext } from 'react';
import MessengerProvider from '../contexts/MessengerContext';
import Conversation from './Conversation';
import ConversationList from './ConversationList';
import { Messenger } from '../types/Messenger';
import { WeavyContext } from '../contexts/WeavyContext';

const Messenger: FC<Messenger> = () => {

    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('Weavy Messenger component must be used within an WeavyProvider');
    }
    
    return (
        <MessengerProvider>
            <div className="wy-messenger-provider">

                <div className="wy-messenger-sidebar wy-scroll-y">
                    <ConversationList />
                </div>

                <div className="wy-messenger-conversation wy-scroll-y">
                    <Conversation id={null} />
                </div>
            </div>
                      
        </MessengerProvider>
    )
}

export default Messenger;