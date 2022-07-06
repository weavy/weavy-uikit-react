import React, { FC, useContext } from 'react';
import MessengerProvider from '../contexts/MessengerContext';
import Conversation from './Conversation';
import ConversationList from './ConversationList';
import { Messenger } from '../types/Messenger';
import { WeavyContext } from '../contexts/WeavyContext';
import { prefix as wy } from "../utils/styles";

const Messenger: FC<Messenger> = () => {

    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('Weavy Messenger component must be used within an WeavyProvider');
    }
    
    return (
        <MessengerProvider>
            <div className={wy('messenger-provider')}>

                <div className={wy('messenger-sidebar scroll-y')}>
                    <ConversationList />
                </div>

                <div className={wy('messenger-conversation scroll-y')}>
                    <Conversation id={null} />
                </div>
            </div>
                      
        </MessengerProvider>
    )
}

export default Messenger;