import { useContext } from "react";
import { useMutation } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PUT to add typing to a conversation
export default function useMutateTyping() {

    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useMutateTyping must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null, 
        type: "posts" | "comments" | "messages",
        location: "apps" | "posts" | "messages" | "files"     
    }

    const mutateTyping = async ({ id, type, location }: MutateProps) => {

        const response = await client.post(`/api/${location}/${id}/${type}/typing`,
            "PUT",
            JSON.stringify({}));

        return response;
    };

    return useMutation(mutateTyping, {});
}