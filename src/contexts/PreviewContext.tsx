import React, { createContext, useEffect, useState } from "react";
import Overlay from '../ui/Overlay';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Preview from '../components/Preview';
import { getIcon, getExtension } from "../utils/fileUtilities";

export const PreviewContext = createContext<PreviewContextProps>({
    openPreview: Function,
    closePreview: Function
});

function allowedKeyTarget(e: any) {
    var notInputField = !e.target.matches("input, textarea, select") && !e.target.closest('[contenteditable="true"]');
    return notInputField;
  }

type Props = {
    client: any,
    children: React.ReactNode
}

const PreviewProvider = ({ client, children }: Props) => {
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
        window.open(`${activeAttachment?.download_url}&d=1`, "_top");
    }

    const handleExternal = () => {
        window.open(`${activeAttachment?.external_url}`, "_blank");
    }

    const handleApplication = () => {
        // TODO: Change to webdav-url
        window.open(`${activeAttachment?.application_url}`, "_top");
    }

    // Keyboard handlers
    useEffect(() => {
        if (activeAttachment) {
            const handleKey = (e: any) => {                
                if (e.which === 27) { // ESC
                    e.stopImmediatePropagation();
                    closePreview()
                } else if (e.which === 37) { // LEFT
                    if (allowedKeyTarget(e)) {
                        setCurrentAttachmentId(previousAttachmentId);
                    }
                } else if (e.which === 39) { // RIGHT
                    if (allowedKeyTarget(e)) {
                        setCurrentAttachmentId(nextAttachmentId);
                    }
                }
            };
    
            document.addEventListener("keyup", handleKey);
    
            return () => {
                // cleanup
                document.removeEventListener("keyup", handleKey);
            }
        }

    }, [activeAttachment])
    

    let activeExt: string = getExtension(activeAttachment?.name || '');
    let activeIcon: string = getIcon(activeAttachment?.name || '').icon;

    let activeSrc = activeAttachment?.preview_url || activeAttachment?.download_url || '';

    // Let GIF and SVG display raw content
    let animatedImage = activeAttachment?.preview_format === "image" && (activeExt === ".gif" || activeExt === ".svg");
    if (animatedImage) {
        activeSrc = activeAttachment?.download_url || '';
    }

    return (
        <>
            <PreviewContext.Provider value={{ openPreview: openPreview, closePreview: closePreview }}>
                {children}
            </PreviewContext.Provider>

            <Overlay.UI isOpen={modalPreviewOpen} className="wy-dark">
                <header className="wy-appbars">
                    <nav className="wy-appbar">
                        <Button.UI onClick={closePreview}><Icon.UI name='close' /></Button.UI>
                        <div className="wy-appbar-text">
                            {activeAttachment &&
                                <span>{activeAttachment.name}</span>
                            }

                        </div>
                        <div className="wy-appbar-buttons">
                            {activeAttachment?.application_url ?
                                <Button.UI onClick={handleApplication} title={`Open in app`}><Icon.UI name={activeIcon} /></Button.UI>
                            :
                                activeAttachment?.external_url ?
                                    <Button.UI onClick={handleExternal} title={`Open in ${activeAttachment.provider}`}><Icon.UI name={activeIcon} /></Button.UI>
                                :
                                    <Button.UI onClick={handleDownload}><Icon.UI name='download' /></Button.UI>
                            }
                        </div>

                    </nav>
                </header>
                <div className="wy-preview wy-scroll-y wy-scroll-x">
                    {activeAttachment &&
                        <>
                            {previousAttachmentId &&
                                <nav className="wy-nav-prev"><Button.UI onClick={handlePrevious}><Icon.UI name="previous" /></Button.UI></nav>
                            }
                            {nextAttachmentId &&
                                <nav className="wy-nav-next"><Button.UI onClick={handleNext}><Icon.UI name="next" /></Button.UI></nav>
                            }
                            <Preview
                                client={client}
                                src={activeSrc}
                                link={activeAttachment.external_url}
                                format={activeAttachment.preview_format}
                                name={activeAttachment.name}
                                icon={activeIcon}
                                width={activeAttachment.width}
                                height={activeAttachment.height}
                                mediaType={activeAttachment.media_type}
                                provider={activeAttachment.provider}
                            />
                        </>
                    }
                </div>
            </Overlay.UI>

        </>

    )
};

export default PreviewProvider;

