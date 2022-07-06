import React, { useContext, useEffect } from "react";
import { WeavyContext } from "../contexts/WeavyContext";
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import useMutateExternalBlobs from '../hooks/useMutateExternalBlobs';
import { UserContext } from "../contexts/UserContext";
import { prefix as wy } from "../utils/styles";

type Props = {
    onFileAdded: Function
}

const FileBrowser = ({ onFileAdded }: Props) => {

    const { options } = useContext(WeavyContext);
    const { user } = useContext(UserContext);

    const addExternalBlobs = useMutateExternalBlobs();

    useEffect(() => {
        window.addEventListener("message", handleFilebrowserMessage);


        return () => {
            window.removeEventListener("message", handleFilebrowserMessage);
        }
    }, []);

    const handleFilebrowserMessage = async (e: any) => {
        const messageData = e.data;

        switch (messageData.name) {
            case "addExternalBlobs":
                var result = await addExternalBlobs.mutateAsync({ blobs: messageData.blobs });
                onFileAdded(result);
                closeFilebrowser();
                break;
            case "file-browser-close":
                closeFilebrowser();
                break;
        }
    }

    const closeFilebrowser = () => {
        let fb = document.getElementById("weavy-filebrowser");
        if (fb) {
            fb.style.display = "none";
        }
    }

    const openFilebrowser = () => {
        let fb = document.getElementById("weavy-filebrowser");

        if (!fb) {
            const origin = window.top?.document.location.origin;
            const fileBrowserUrl = options?.filebrowserUrl;
            const filebrowserSrc = fileBrowserUrl + "?origin=" + origin + "&v=X&t=" + Date.now().toString() + "&weavyId=-1";

            let $filebrowserFrame = document.createElement("iframe");
            $filebrowserFrame.id = "weavy-filebrowser";
            $filebrowserFrame.name = "weavy-filebrowser";
            $filebrowserFrame.src = filebrowserSrc;
            $filebrowserFrame.className = wy('filebrowser-frame');
            $filebrowserFrame.style.cssText = "position: fixed; top: 0; left: 0; height: 100%; width: 100%; background: rgba(1,1,1,.4); z-index: 10000; display:none"

            window.top?.document.body.appendChild($filebrowserFrame);

            $filebrowserFrame.addEventListener('load', () => {
                $filebrowserFrame.style.display = "block";
            });

        } else {
            fb.style.display = "block";
        }
    }

    return (
        <>
            {options?.enableCloudFiles && 
                <Button.UI onClick={openFilebrowser} title="Add file from cloud"><Icon.UI name="cloud" /></Button.UI>
            }            
        </>
    )
}

export default FileBrowser;