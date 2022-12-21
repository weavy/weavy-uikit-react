import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import useMutateExternalBlobs from "../hooks/useMutateExternalBlobs";
import Overlay from '../ui/Overlay';
import Spinner from '../ui/Spinner';
import WeavyPostal from "../utils/postal-parent";

export const CloudFilesContext = createContext<CloudFilesContextProps>({
    open: Function    
});

type Props = {
    client: any,
    options: WeavyContextOptions, // pass client here to avoid circular references from WeavyContext
    children: React.ReactNode
}

let addFunc = ([]:any) => {};

const CloudFilesProvider = ({ children, options, client }: Props) => {    
    const [modalOpen, setModalOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [frameSrc, setFrameSrc] = useState("");
    
    const fileBrowserUrl = options?.filebrowserUrl || "";
    const addExternalBlobs = useMutateExternalBlobs(client);

    const frameRef = useCallback((node: HTMLIFrameElement | null) => {
        if (node !== null && node.contentWindow != null) {
            WeavyPostal.registerContentWindow(node.contentWindow.self, "weavy-filebrowser", "wy-filebrowser", new URL(fileBrowserUrl).origin);
        }
    }, []);

    

    useEffect(() => {
        var origin = "";

        // Get top origin
        try {
            if (window.location.ancestorOrigins && 0 < window.location.ancestorOrigins.length) {
                // Not available in FF, but Google APIs use this
                origin = window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1];
            } else if (window.top) {
                // This may fail due to cors
                origin = window.top.document.location.origin;
            } 
        } catch(e) { /* No worries */}
        
        if (!origin) {
            try {
                origin = window.self.document.location.origin;
            } catch(e) {
                console.error("Filebrowser: Could not read current origin.");
            }
        }

        const filebrowserSrc = fileBrowserUrl + "?origin=" + origin + "&v=X&t=" + Date.now().toString() + "&weavyId=wy-filebrowser";

        setFrameSrc(filebrowserSrc)

        WeavyPostal.on("add-external-blobs", handleFiles);
        WeavyPostal.on("request:file-browser-close", handleClose);

        return () => {
            WeavyPostal.off("add-external-blobs", handleFiles);
            WeavyPostal.off("request:file-browser-close", handleClose);
        }
    }, []);

    const handleFiles = async (e: Event, message: any) => {
        let result:any[] = [];
        for(let i = 0; i < message.blobs.length; i++){
            let uploadResult = await addExternalBlobs.mutateAsync({blob: message.blobs[i]});
            if(uploadResult.errors){
                console.error(uploadResult.errors)
            } else{
                result.push(uploadResult);
            }                        
        }                
        addFunc(result);                
        closeFilebrowser();
    }

    const handleOpen = (callback: ([]:any) => {}) => {        
        addFunc = callback        
        setModalOpen(true);
    }

    const handleClose = () => {
        closeFilebrowser();
    }

    const closeFilebrowser = () => {
        setModalOpen(false);
        setVisible(false);
    }

    const handleFrameLoad = () => {        
        setVisible(true);
    }

    return (
        <>
            <CloudFilesContext.Provider value={{open: handleOpen}}>
                {children}
            </CloudFilesContext.Provider>

            <Overlay.UI isOpen={modalOpen} className="wy-modal wy-panel wy-loaded">
                {!visible &&
                    <Spinner.UI overlay={true} />
                }

                <iframe ref={frameRef} onLoad={handleFrameLoad} src={frameSrc} className="wy-panel-frame" id="weavy-filebrowser" name="weavy-filebrowser"></iframe>

            </Overlay.UI>
        </>


    )
};

export default CloudFilesProvider;

