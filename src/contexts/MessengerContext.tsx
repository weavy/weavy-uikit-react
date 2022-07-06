import React, { createContext, useState } from "react";
import usePresence from "../hooks/usePresence";

export const MessengerContext = createContext<MessengerContextProps>({
    selectedConversationId: null,
    setSelectedConversationId: (id: any) => { }    
});

type Props = {
    children: React.ReactNode    
}

const MessengerProvider = ({ children }: Props) => {

    const [selectedConversationId, setSelectedConversation] = useState(null);

    // hook up to presence updates
    usePresence();

    const setSelectedConversationId = (id: any) => {
        setSelectedConversation(id);
    }

    return (
        <>
            <MessengerContext.Provider value={{ selectedConversationId, setSelectedConversationId }}>
                {children}
            </MessengerContext.Provider>
        </>


    )
};

export default MessengerProvider;

