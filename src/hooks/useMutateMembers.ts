import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// PUT to update members in an app
export default function useMutateMembers() {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateMembers must be used within an WeavyProvider');
    }


    type MutateProps = {
        id: number | null, 
        members: number[]
    }

    // add members to conversation
    const mutateMembers = async ({ id, members }: MutateProps) => {

        const response = await fetch(client.url + "/api/apps/" + id + "/members/", {
            method: "POST",
            body: JSON.stringify(members),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + await client.tokenFactory()
            }
        });

        return response;
    };

    return useMutation(mutateMembers, {
        onSuccess: (data: any, variables: any, context: any) => {
            queryClient.invalidateQueries("conversations");                       
            queryClient.invalidateQueries(["conversation", variables.id]);     
            queryClient.invalidateQueries(["members", variables.id]);     
        }        
    });
}