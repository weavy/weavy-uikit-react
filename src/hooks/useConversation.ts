import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { ConversationType } from "../types/types";

/// GET a specific conversation
export default function useConversation(id: number | null, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useConversation must be used within an WeavyProvider');
    }

    const getConversation = async () => {
        const response = await client.get("/api/conversations/" + id);
        const data = await response.json();                        
        return data;
    };


    return useQuery<ConversationType>(["conversation", id], getConversation, options);
}
