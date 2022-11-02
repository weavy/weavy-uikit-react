import React, { useContext, useEffect, useState } from "react";
import { WeavyContext } from "../contexts/WeavyContext";
import useBadge from "../hooks/useBadge";

const ConversationBadge = () => {
    const { client } = useContext(WeavyContext);
    const [badge, setBadge] = useState<number>(0);

    if (!client) {
        throw new Error('Weavy Badge component must be used within an WeavyProvider');
    }

    const { isLoading, data, refetch } = useBadge();

    const handleBadge = (data: BadgeType) => {        
        refetch();
    }

    useEffect(() => {
        if(data){
            setBadge(data.private + data.rooms);
        }        
    }, [data])

    useEffect(() => {
        client.subscribe(null, "message_created", handleBadge);
        client.subscribe(null, "conversation_marked", handleBadge);

        return () => {
            client.unsubscribe(null, "message_created", handleBadge);
            client.unsubscribe(null, "conversation_marked", handleBadge);
        }
    }, [])

    return (
        <>
            {!isLoading && badge > 0 &&
                <span className="wy-badge wy-badge-danger">{badge}</span>
            }
        </>

    )
}

export default ConversationBadge;