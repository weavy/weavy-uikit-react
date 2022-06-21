import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { WeavyContext } from '../contexts/WeavyContext';

type Props = {
    id: number,
    context: string // use context to create handlers to make them unique. This makes the useRealTime hook NOT to unsubscribe to the eventhandlers.
    children: any
}

const Typing = ({ children, id, context }: Props) => {
    const [activeTypers, setActiveTypers] = useState<any>([]);
    const [text, setText] = useState<string>("");
    const typingTimeout = useRef<any>(null);
    const { client } = useContext(WeavyContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        updateTyping();

        return () => {
            clearTimeout(typingTimeout.current);
        };
    }, [activeTypers, id, context]);

    useEffect(() => {
        setActiveTypers([]);
        
        client?.subscribe(`a${id}`, "typing", handleTyping);        
        client?.subscribe(`a${id}`, "message-inserted", handleStopTyping);

        return () => {
            client?.unsubscribe(`a${id}`, "typing", handleTyping);            
            client?.unsubscribe(`a${id}`, "message-inserted", handleStopTyping);
        }
    }, [id])

    const updateTyping = () => {

        let typers = activeTypers;
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
            typingTimeout.current = null;
        }

        // discard typing events older than 5 seconds
        let now = Date.now();
        typers.forEach(function (item: any, index: number) {
            if (now - item.time > 5 * 1000) {
                typers.splice(index, 1);
            }
        });

        if (typers.length) {
            // use age of typing event to animate ellipsis...
            let dots = (Math.round((now - Math.max.apply(null, typers.map(function (x: any) { return x.time; }))) / 1000) % 3) + 1;

            let ellipsis = (".").repeat(dots); //+ (".").repeat(3 - dots);

            // merge names of people typing
            let names = typers.map((item: any) => item.display_name).sort();

            let typingText = "";
            for (let i = 0; i < names.length; i++) {
                if (i > 0) {
                    if (i === (names.length - 1)) {
                        typingText += " " + "and" + " ";
                    } else {
                        typingText += ", ";
                    }
                }
                typingText += names[i];
            }
            if (names.length === 1) {
                typingText += " " + "is typing";
            } else {
                typingText += " " + "are typing";
            }

            // update gui
            setText(typingText + ellipsis);

            // schedule another call to updateTyping in 1 second
            typingTimeout.current = setTimeout(updateTyping, 1000);
        } else {
            setText("");
        }
    }

    const setTypers = (data: any) => {
        
        // remove existing typing events by this user (can only type in one conversation at a time)
        activeTypers.forEach(function (item: any, index: number) {
            if (item.member.id === data.member.id) {
                setActiveTypers(activeTypers.splice(index, 1));
            }
        });

        // track time when we received this event
        data.member.time = Date.now();
        setActiveTypers([...activeTypers, data.member]);
    }

    const handleTyping = useCallback((data: any) => {               
        if (data.conversation.id === id && data.member.id !== user.id) {            
            setTypers(data);
        }

    }, [id, context, activeTypers]);

    const handleStopTyping = useCallback((data: any) => {        
        if (data.app_id === id) {
            setActiveTypers([]);
        }
    }, [id, context, activeTypers]);
    
    return (
        <>
            {text !== "" &&
                <>{text}</>
            }
            {text === "" &&
                <>{children}</>
            } 
        </>


    )
}

export default React.memo(Typing);