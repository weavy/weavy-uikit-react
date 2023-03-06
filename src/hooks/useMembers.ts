import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { MembersResult } from "../types/types";

/// GET all members in an app
export default function useMembers(id: number | null, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useMembers must be used within an WeavyProvider');
    }

    const getMembers = async () => {
        const response = await client.get(`/api/apps/${id}/members?top=1000`);
        const data = await response.json();                
        return data;
    };


    return useQuery<MembersResult>(["members", id], getMembers, options);
}
