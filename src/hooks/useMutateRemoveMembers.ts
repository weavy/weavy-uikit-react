import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MessengerContext } from "../contexts/MessengerContext";
import { WeavyContext } from "../contexts/WeavyContext";

/// DELETE to remove members from an app
export default function useMutateRemoveMembers() {

    const { client } = useContext(WeavyContext);
    const { setSelectedConversationId } = useContext(MessengerContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateRemoveMembers must be used within an WeavyProvider');
    }


    type MutateProps = {
        id:  number | null, 
        members: number[]
    }

    const mutateRemove = async ({ id, members }: MutateProps) => {

        const response = await fetch(client.uri + "/api/apps/" + id + "/members/" + members.join(","), {
            method: "DELETE",        
            body: JSON.stringify(members),    
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response;
    };

    return useMutation(mutateRemove, {
        onSuccess: () => {
            queryClient.invalidateQueries("conversations");         
            setSelectedConversationId(null);   
        }        
    });
}