import React, { useContext } from 'react';
import MessengerProvider from '../contexts/MessengerContext';
import Conversation from './Conversation';
import ConversationList from './ConversationList';
import { WeavyContext } from '../contexts/WeavyContext';
import classNames from 'classnames';

type Props = {
    className?: string,
}

const Messenger: ({ className }: Props) => React.JSX.Element = ({ className }: Props) => {

    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('Weavy Messenger component must be used within an WeavyProvider');
    }
    
    return (
        <MessengerProvider>
            <div className={classNames("wy-messenger-provider", className)}>

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