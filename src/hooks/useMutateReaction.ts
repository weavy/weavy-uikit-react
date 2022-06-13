import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "../contexts/UserContext";
import { WeavyContext } from "../contexts/WeavyContext";

/// POST to add a reaction to a message
export default function useMutateReaction() {

    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);

    if (!client) {
        throw new Error('useMutateReaction must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        reaction: string        
    }

    const mutateReaction = async ({id, reaction }: MutateProps) => {

      
        const response = await fetch(client.uri + "/api/messages/" + id + "/reactions/", {
            method: "POST",
            body: JSON.stringify({ content: reaction}),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response;
    };

    return useMutation(mutateReaction);
}