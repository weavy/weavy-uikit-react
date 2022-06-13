import React, { createContext, useEffect, useState } from "react";
import Overlay from '../ui/Overlay';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { prefix as wy } from "../utils/styles";

export const PreviewContext = createContext<PreviewContextProps>({
    openPreview: Function,
    closePreview: Function
});

type Props = {
    children: React.ReactNode
}

const PreviewProvider = ({ children }: Props) => {
    const [modalPreviewOpen, setModalPreviewOpen] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<AttachmentType[]>([]);
    const [activeAttachment, setActiveAttchment] = useState<AttachmentType>();

    const [currentAttachmentId, setCurrentAttachmentId] = useState<number | null>();
    const [nextAttachmentId, setNextAttachmentId] = useState<number | null>();
    const [previousAttachmentId, setPreviousAttachmentId] = useState<number | null>();

    useEffect(() => {

        if (currentAttachmentId) {
            var itemIndex = attachments.map(function (a: AttachmentType) { return a.id; }).indexOf(currentAttachmentId);

            setPreviousAttachmentId(itemIndex > 0 ? attachments[itemIndex - 1].id : null);
            setNextAttachmentId(itemIndex + 1 < attachments.length ? attachments[itemIndex + 1].id : null);
            setActiveAttchment(attachments.find((a: AttachmentType) => a.id === currentAttachmentId));
        }

    }, [attachments, currentAttachmentId])

    const openPreview = (attachments: AttachmentType[], id: number) => {
        setAttachments(attachments);
        setCurrentAttachmentId(id);

        setModalPreviewOpen(true);
    }

    const closePreview = () => {
        setModalPreviewOpen(false);
    }

    const handlePrevious = () => {
        setCurrentAttachmentId(previousAttachmentId);
    }

    const handleNext = () => {
        setCurrentAttachmentId(nextAttachmentId);
    }

    const handleDownload = () => {
        window.open(`${activeAttachment?.download_url}&d=1`, "_blank");
    }

    return (
        <>

            <PreviewContext.Provider value={{ openPreview: openPreview, closePreview: closePreview }}>
                {children}
            </PreviewContext.Provider>

            <Overlay.UI isOpen={modalPreviewOpen} className={wy('dark')}>
                <header className={wy('appbars')}>
                    <nav className={wy('appbar')}>
                        <Button.UI onClick={closePreview}><Icon.UI name='close' /></Button.UI>
                        <div className={wy('appbar-text')}>
                            {activeAttachment &&
                                <span>{activeAttachment.name}</span>
                            }

                        </div>
                        <Button.UI onClick={handleDownload}><Icon.UI name='download' /></Button.UI>
                    </nav>
                </header>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>

                    {activeAttachment &&
                        <>
                            {previousAttachmentId &&
                                <Button.UI onClick={handlePrevious} style={{ position: "absolute", top: "50%", left: "0" }}><Icon.UI name="previous" /></Button.UI>
                            }
                            {nextAttachmentId &&
                                <Button.UI onClick={handleNext} style={{ position: "absolute", top: "50%", right: "0", }}><Icon.UI name="next" /></Button.UI>
                            }

                            <img style={{ maxWidth: "100%" }} src={activeAttachment.preview_url} />
                        </>
                    }

                </div>
            </Overlay.UI>

        </>


    )
};

export default PreviewProvider;

