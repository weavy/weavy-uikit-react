import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET all members in an app
export default function useMembers(id: number | null, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useMembers must be used within an WeavyProvider');
    }

    const getConversationMembers = async () => {

        const response = await fetch(client.url + "/api/apps/" + id + "/members", {
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });
        const data = await response.json();                
        return data;
    };


    return useQuery<MembersResult>(["members", id], getConversationMembers, options);
}
