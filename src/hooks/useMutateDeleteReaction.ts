import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "../contexts/UserContext";
import { WeavyContext } from "../contexts/WeavyContext";

/// DELETE to remove a reaction from a message
export default function useMutateDeleteReaction() {

    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);

    if (!client) {
        throw new Error('useMutateDeleteReaction must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null,
        reaction: string
    }

    const mutateDeleteReaction = async ({ id, reaction }: MutateProps) => {

        // remove the existing reaction
        const response = await fetch(client.url + "/api/messages/" + id + "/reactions/", {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });


        return response;
    };

    return useMutation(mutateDeleteReaction);
}