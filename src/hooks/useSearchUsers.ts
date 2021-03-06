import { useContext } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET users by search query
export default function useSearchUsers(text: string, options: any) {
    const PAGE_SIZE = 10;
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useSearchUsers must be used within an WeavyProvider');
    }

    const getUsers = async () => {
        const response = await fetch(client.url + "/api/users?q=" + text + "&skip=0&top=" + PAGE_SIZE, {
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });
        const data = await response.json();
        return data;
    };

    return useQuery<MembersResult>('users', getUsers, options)
}
