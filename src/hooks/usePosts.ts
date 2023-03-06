import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { PostsType } from "../types/types";

/// GET a specific Posts app
export default function usePosts(id: string, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('usePosts must be used within an WeavyProvider');
    }

    const getPosts = async () => {
        const response = await client.get("/api/apps/" + id);
        const data = await response.json();
        return data;
    };


    return useQuery<PostsType>(["posts", id], getPosts, options);
}
