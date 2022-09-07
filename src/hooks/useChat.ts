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
        const response = await client.get("/api/apps/" + id);
        const data = await response.json();
        return data;
    };


    return useQuery<ConversationType>(["chat", id], getConversation, options);
}
