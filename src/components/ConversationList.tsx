import React, { useContext, useEffect } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import useConversations from '../hooks/useConversations';
import ConversationListItem from './ConversationListItem';
import NewConversation from './NewConversation';
import Avatar from './Avatar';
import { UserContext } from '../contexts/UserContext';

const ConversationList = () => {
    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);
    const { data, isLoading, refetch } = useConversations();

    if (!client) {
        throw new Error('Weavy ConversationList component must be used within an WeavyProvider');
    }

    useEffect(() => {

        client.subscribe(null, "app-inserted", handleAppInserted);
        client.subscribe(null, "member-added", handleAppInserted);

        return () => {
            client.unsubscribe(null, "app-inserted", handleAppInserted);
            client.unsubscribe(null, "member-added", handleAppInserted);
        }
    }, []);

    const handleAppInserted = (data: ConversationType) => {
        refetch();
    }


    if (isLoading) {
        return (
            <div>Loading Conversation list...</div>
        )
    }

    return (
        <>
            <header className="wy-appbars">
                <nav className="wy-appbar">
                    <Avatar src={user.avatar_url} name={user.title} presence={user.presence} id={user.id} size={24} />
                    <div>Messenger</div>
                    <NewConversation />
                </nav>
            </header>
            <div className="wy-conversations">
                {data && data.data?.map((item) =>
                    <ConversationListItem key={item.id} refetchConversations={refetch} item={item} />
                )}

                {/* <a className="wy-pager"><svg className="wy-spinner wy-spin" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle fill="none" cx="12" cy="12" r="11" stroke-linecap="butt" stroke-width="2"></circle></svg></a> */}
            </div>
        </>
    )
}

export default ConversationList;