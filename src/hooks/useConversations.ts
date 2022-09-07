import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET all conversations
export default function useConversations() {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useConversations must be used within an WeavyProvider');
    }

    const getConversations = async () => {
        const response = await client.get("/api/conversations?contextual=false");
        const data = await response.json();                        
        return data;
    };


    return useQuery<ConversationsResult>("conversations", getConversations);
}
