import React, { useContext, useEffect, useState } from "react";
import { WeavyContext } from "../contexts/WeavyContext";
import useBadge from "../hooks/useBadge";
import { prefix as wy } from "../utils/styles";

const ConversationBadge = () => {
    const { client } = useContext(WeavyContext);
    const [badge, setBadge] = useState<number>(0);

    if (!client) {
        throw new Error('Weavy Badge component must be used within an WeavyProvider');
    }

    const { isLoading, data } = useBadge();

    const handleBadge = (data: BadgeType) => {
        setBadge(data.private + data.rooms);
    }

    useEffect(() => {
        if(data){
            setBadge(data.private + data.rooms);
        }        
    }, [data])

    useEffect(() => {
        client.subscribe(null, "conversation-badge", handleBadge);

        return () => {
            client.unsubscribe(null, "conversation-badge", handleBadge);
        }
    }, [])

    return (
        <>
            {!isLoading && badge > 0 &&
                <span className={wy('badge badge-danger')}>{badge}</span>
            }
        </>

    )
}

export default ConversationBadge;