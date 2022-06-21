//import { useContext } from "react";
import { useQuery } from "react-query";
import WeavyClient from "../client/WeavyClient";
//import { WeavyContext } from "../contexts/WeavyContext";

/// GET current user
export default function useUser(client: WeavyClient) {
    //const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useUser must be used within an WeavyProvider');
    }

    const getUser = async () => {

        try {
            const response = await fetch(client.url + "/api/user", {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + await client.tokenFactory()
                }
            });
    
            if(response.ok){
                return await response.json();            
            }
    
            console.error("Could not load Weavy user data...")
            return null;
        } catch(err: any){
            console.error(`Could not connect to the Weavy backend. Please make sure ${client.url} is up and running!`)
        }
        
        
    };


    return useQuery<UserType>("user", getUser);
}
