import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET who reacted on an entity
export default function useReactionList(id: number, type: string, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useReactionList must be used within an WeavyProvider');
    }

    const getReactions = async () => {
        const response = await client.get(`/api/${type}/${id}/reactions`);
        const data = await response.json();
        return data;
    };


    return useQuery<ReactionsResult>(["reactions", id, type], getReactions, options);
}
