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
        id: number | null
    }

    const mutateTyping = async ({ id }: MutateProps) => {

        const response = await client.post("/api/conversations/" + id + "/typing",
            "PUT",
            JSON.stringify({}));

        return response;
    };

    return useMutation(mutateTyping, {});
}