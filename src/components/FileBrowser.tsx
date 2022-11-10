import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { WeavyContext } from "../contexts/WeavyContext";
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import useMutateExternalBlobs from '../hooks/useMutateExternalBlobs';
import Overlay from '../ui/Overlay';
import WeavyPostal from "../utils/postal-parent";

type Props = {
    onFileAdded: Function
}

const FileBrowser = ({ onFileAdded }: Props) => {

    const { options } = useContext(WeavyContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [frameSrc, setFrameSrc] = useState("");
    const addExternalBlobs = useMutateExternalBlobs();
    const fileBrowserUrl = options?.filebrowserUrl || "";

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
    }, [onFileAdded]);

    const toggleModal = (open: boolean) => {
        setModalOpen(open);
    }

    const handleFiles = async (e: Event, message: any) => {
        var result = await addExternalBlobs.mutateAsync({ blobs: message.blobs });
        onFileAdded(result);
        closeFilebrowser();
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
            {options?.enableCloudFiles &&
                <>
                    <Button.UI onClick={() => toggleModal(true)} title="Add file from cloud"><Icon.UI name="cloud" /></Button.UI>

                    <Overlay.UI isOpen={modalOpen} className="wy-modal wy-panel wy-loaded">
                        {!visible &&
                            <Spinner.UI overlay={true} />
                        }

                        <iframe ref={frameRef} onLoad={handleFrameLoad} src={frameSrc} className="wy-panel-frame" id="weavy-filebrowser" name="weavy-filebrowser"></iframe>

                    </Overlay.UI>
                </>
            }
        </>
    )
}

export default FileBrowser;