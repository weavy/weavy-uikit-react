import { useContext } from "react";

import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET a specific conversation
export default function useConversation(id: number | null, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useConversation must be used within an WeavyProvider');
    }

    const getConversation = async () => {

        const response = await fetch(client.url + "/api/conversations/" + id, {
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });
        const data = await response.json();                        
        return data;
    };


    return useQuery<ConversationType>(["conversation", id], getConversation, options);
}
