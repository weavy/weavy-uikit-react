import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { MessageType } from "../types/types";

/// GET a specific post
export default function usePost(id: number, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('usePost must be used within an WeavyProvider');
    }

    const getPost = async () => {
        const response = await client.get("/api/posts/" + id);
        return response.json();        
    };


    return useQuery<MessageType>(["post", id], getPost, options);
}
