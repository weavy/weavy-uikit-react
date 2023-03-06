import { useQuery } from "react-query";
import { UserType, IWeavyClient } from "../types/types";

/// GET current user
export default function useUser(client: IWeavyClient) {    
    if (!client) {
        throw new Error('useUser must be used within an WeavyProvider');
    }

    const getUser = async () => {

        try {
            const response = await client.get("/api/user");            
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
