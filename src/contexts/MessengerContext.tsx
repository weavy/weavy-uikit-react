import React, { createContext, useState } from "react";
import usePresence from "../hooks/usePresence";

export const MessengerContext = createContext<MessengerContextProps>({
    selectedConversationId: null,
    setSelectedConversationId: (id: any) => { },
    options: {}
});

type Props = {
    children: React.ReactNode,
    options?: MessengerContextOptions
}

const MessengerProvider = ({ children, options }: Props) => {

    let defaultOptions: MessengerContextOptions = {
        reactions: ['😍', '😎', '😉', '😜', '👍']
    };

    let opts = { ...defaultOptions, ...options };

    const [selectedConversationId, setSelectedConversation] = useState(null);

    // hook up to presence updates
    usePresence();

    const setSelectedConversationId = (id: any) => {
        setSelectedConversation(id);
    }

    return (
        <>
            <MessengerContext.Provider value={{ options: opts, selectedConversationId, setSelectedConversationId }}>
                {children}
            </MessengerContext.Provider>
        </>


    )
};

export default MessengerProvider;

