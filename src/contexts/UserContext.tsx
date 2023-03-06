import React, { createContext} from "react";
import useUser from "../hooks/useUser";
import { UserContextProps } from "../types/types";

export const UserContext = createContext<UserContextProps>({
    user: { id: -1, uid: "", username: "anonymous", name: "Anonymous", email: "", display_name: "", presence: "", avatar_url: "" }    
});

type Props = {
    client: any, // pass client here to avoid circular references from WeavyContext
    children: React.ReactNode    
}

const UserProvider = ({ children, client }: Props) => {

    const { isLoading, data } = useUser(client);
        
    return (
        <>
            {!isLoading && data &&
                <UserContext.Provider value={{ user: data }}>
                    {children}
                </UserContext.Provider>
            }
        </>


    )
};

export default UserProvider;

