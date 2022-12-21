import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET votes for an option
export default function useVotes(id: number, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useVotes must be used within an WeavyProvider');
    }

    const getVotes = async () => {
        const response = await client.get(`/api/options/${id}/voters`);
        const data = await response.json();
        return data;
    };


    return useQuery<UserType[]>(["votes", id], getVotes, options);
}
