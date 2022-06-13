import { useContext, useEffect } from "react";
import { WeavyContext } from "../contexts/WeavyContext";
import { prefix as wy } from "../utils/styles";

export default function usePresence() {

    const {client} = useContext(WeavyContext);
    
    useEffect(() => {
        client.subscribe("online", "online", handlePresenceChange)
    }, []);

    const handlePresenceChange = (data: any) => {        
        
        if (Array.isArray(data)) {
            document.querySelectorAll(wy(".presence")).forEach(function (item) {
                item.classList.remove(wy("presence-active"));
            });

            data.forEach(function (id) {
                document.querySelectorAll("[data-presence-id='" + id + "']").forEach(function (item) {
                    item.classList.add(wy("presence-active"));
                });
            });
        } else {
            document.querySelectorAll("[data-presence-id='" + data + "']").forEach(function (item) {
                item.classList.add(wy("presence-active"));
            });
        }
    }

}