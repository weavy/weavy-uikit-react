import React, { createContext, useEffect, useState } from "react";
import Overlay from '../ui/Overlay';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Preview from '../components/Preview';
import { getIcon, getExtension } from "../utils/fileUtilities";
import classNames from "classnames";
import openUrl from "../utils/openUrl";
import { FileType, PreviewContextProps } from "../types/types";

export const PreviewContext = createContext<PreviewContextProps>({
    openPreview: Function,
    closePreview: Function,
    setPreviewFiles: Function
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
 
    const [files, setFiles] = useState<FileType[]>();
    const [activeFile, setActiveFile] = useState<FileType>();
    
    const [currentFileId, setCurrentFileId] = useState<number>();
    const [nextFileId, setNextFileId] = useState<number>();
    const [previousFileId, setPreviousFileId] = useState<number>();

    
    useEffect(() => {          
        if (currentFileId) {
            if (files) {
                let itemIndex = files.map(function (a: FileType) { return a.id; }).indexOf(currentFileId);
                
                setPreviousFileId(itemIndex > 0 ? files[itemIndex - 1].id : undefined);
                setNextFileId(itemIndex + 1 < files.length ? files[itemIndex + 1].id : undefined);
                setActiveFile(files.find((a: FileType) => a.id === currentFileId));
            }
        }

    }, [files, files?.length, currentFileId])

    const setPreviewFiles = (fileList: FileType[]) => {
        //console.log("setPreviewFiles", fileList, isValidInfiniteQuery(fileList) ? "infinite files": "files")
        setFiles(fileList);
    };

    const openPreview = (id: number) => {
        setCurrentFileId(id);
        setModalPreviewOpen(true);
    }

    const closePreview = () => {
        setModalPreviewOpen(false);
    }

    const handlePrevious = () => {
        setCurrentFileId(previousFileId);
    }

    const handleNext = () => {
        setCurrentFileId(nextFileId);
    }

    const handleDownload = () => {
        if (activeFile && activeFile.download_url) {
           openUrl(activeFile.download_url, "_top", activeFile.name, true)
        }
    }

    const handleExternal = () => {
        if (activeFile && activeFile.external_url) {
            openUrl(activeFile.external_url, "_blank", activeFile.name)
         }
    }

    const handleApplication = () => {
        if (activeFile && activeFile.application_url) {
            openUrl(activeFile.application_url, "_top", activeFile.name)
         }
    }

    // Keyboard handlers
    useEffect(() => {
        if (activeFile) {
            const handleKey = (e: any) => {     
                if (modalPreviewOpen) {
                    if (e.which === 27) { // ESC
                        e.stopImmediatePropagation();
                        closePreview()
                    } else if (e.which === 37) { // LEFT
                        if (allowedKeyTarget(e)) {
                            e.stopPropagation();
                            setCurrentFileId(previousFileId);
                        }
                    } else if (e.which === 39) { // RIGHT
                        if (allowedKeyTarget(e)) {
                            e.stopPropagation();
                            setCurrentFileId(nextFileId);
                        }
                    }
                }           
            };
    
            document.addEventListener("keyup", handleKey, true);
    
            return () => {
                // cleanup
                document.removeEventListener("keyup", handleKey, true);
            }
        }

    }, [activeFile, modalPreviewOpen])

    let activeIcon: string = getIcon(activeFile?.name || '').icon;

    let previewExt: string = getExtension(activeFile?.name || '');
    let previewIcon: string = getIcon(activeFile?.name || '').icon;

    let previewSrc = activeFile?.preview_url || activeFile?.download_url || '';

    // Let GIF and SVG display raw content
    let animatedImage = activeFile?.preview_format === "image" && (previewExt === ".gif" || previewExt === ".svg");
    if (animatedImage) {
        previewSrc = activeFile?.download_url || '';
    }

    return (
        <>
            <PreviewContext.Provider value={{ openPreview: openPreview, closePreview: closePreview, setPreviewFiles: setPreviewFiles }}>
                {children}
            </PreviewContext.Provider>

            {files && <Overlay.UI isOpen={modalPreviewOpen} className="wy-dark" closeOnEsc={false} onClose={() => setModalPreviewOpen(false)}>
                <header className="wy-appbars">
                    <nav className="wy-appbar">
                        <Button.UI onClick={closePreview}><Icon.UI name='close' /></Button.UI>
                        <div className={classNames("wy-appbar-text", { "wy-appbar-text-trashed": activeFile?.is_trashed })}>
                            {activeFile &&
                                <span>{activeFile.name}</span>
                            }

                        </div>
                        <div className="wy-appbar-buttons">
                            {activeFile && <Button.UI onClick={handleDownload}><Icon.UI name='download' /></Button.UI> }
                        </div>

                    </nav>
                </header>
                
                <div className="wy-main">  
                    <div className="wy-preview">
                        {activeFile &&
                            <>
                                {previousFileId &&
                                    <nav className="wy-nav-prev"><Button.UI onClick={handlePrevious}><Icon.UI name="previous" /></Button.UI></nav>
                                }
                                {nextFileId &&
                                    <nav className="wy-nav-next"><Button.UI onClick={handleNext}><Icon.UI name="next" /></Button.UI></nav>
                                }
                                <div className="wy-preview-area wy-scroll-y wy-scroll-x">
                                    <Preview
                                        client={client}
                                        src={previewSrc}
                                        link={activeFile.external_url}
                                        format={activeFile.is_trashed ? "none" : activeFile.preview_format}
                                        name={activeFile.name}
                                        icon={previewIcon}
                                        width={activeFile.width}
                                        height={activeFile.height}
                                        mediaType={activeFile.media_type}
                                        provider={activeFile.provider}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Overlay.UI>}

        </>

    )
};

export default PreviewProvider;

