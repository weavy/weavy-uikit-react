import { useContext, useEffect } from "react";
import { PreviewContext } from "../contexts/PreviewContext";


export default function usePreview(attachments: AttachmentType[]) {

    const { openPreview, closePreview } = useContext(PreviewContext);

    const open = (attachmentId: number) => {        
        openPreview(attachments, attachmentId);
    }

    const close = () => {
        closePreview()
    }

    return {
        open,
        close
    }
}