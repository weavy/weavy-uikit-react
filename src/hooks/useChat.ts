import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET a specific conversation
export default function useChat(id: string, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useChat must be used within an WeavyProvider');
    }

    const getConversation = async () => {

        const response = await fetch(client.url + "/api/apps/idf/" + id, {
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });
        if(response.ok){
            const data = await response.json();                        
            return data;
        }

        return null;
        
    };


    return useQuery<ConversationType>(["chat", id], getConversation, options);
}
