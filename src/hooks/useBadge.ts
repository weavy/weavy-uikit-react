import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { BadgeType } from "../types/types";

/// GET the conversation badge
export default function useBadge() {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useBadge must be used within an WeavyProvider');
    }

    const getBadge = async () => {

        const response = await client.get("/api/conversations/badge")
        
        if(response.ok){
            const data = await response.json();                        
            return data;
        }

        return null;
        
    };


    return useQuery<BadgeType>("badge", getBadge);
}
