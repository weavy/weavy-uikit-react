import React, { useContext, useEffect, useState } from "react";
import Overlay from '../ui/Overlay';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Preview from './Preview';
import { getIcon, getExtension } from "../utils/fileUtilities";
import { InfiniteData, UseInfiniteQueryResult } from "react-query";
import Dropdown from "../ui/Dropdown";
import { FileMenu } from "./FileItem";
import classNames from "classnames";
import Comments from "./Comments";
import FileVersions from "./FileVersions";
import { WeavyContext } from '../contexts/WeavyContext';

function allowedKeyTarget(e: any) {
    var notInputField = !e.target.matches("input, textarea, select") && !e.target.closest('[contenteditable="true"]');
    return notInputField;
}

type Props = {
    appId: number,
    infiniteFiles: UseInfiniteQueryResult<FilesResult, unknown>,
    previewId?: number,
    onClose?: () => void
}

const PreviewFiles = ({ appId, infiniteFiles, previewId, onClose }: Props) => {
    const { client } = useContext(WeavyContext);
    
    const [modalPreviewOpen, setModalPreviewOpen] = useState<boolean>(false);
    const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
    const [versionsOpen, setVersionsOpen] = useState<boolean>(false);
    const [sidebarMaximized, setSidebarMaximized] = useState<boolean>(false);

    const [activeFile, setActiveFile] = useState<FileType>();
    const [versionFile, setVersionFile] = useState<FileType>();

    const [currentFileId, setCurrentFileId] = useState<number>();
    const [nextFileId, setNextFileId] = useState<number>();
    const [previousFileId, setPreviousFileId] = useState<number>();

    const { isLoading, data: filesData, dataUpdatedAt, fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteFiles;
    
    // sidebar effects

    useEffect(() => {
        if (!versionsOpen && !commentsOpen) {
            //restore maximize on close
            setSidebarMaximized(false);
        }

        if (!versionsOpen) {
            setVersionFile(undefined);
        }
    }, [versionsOpen, commentsOpen])

    useEffect(() => {
        setVersionFile(undefined);
    }, [activeFile])

    const toggleSidebarTab = (tab?: "comments" | "versions", state?: boolean) => {
        if (tab === "comments") {
            setVersionsOpen(false);
            setCommentsOpen(state !== undefined ? state : !commentsOpen);
        } else if(tab === "versions") {
            setCommentsOpen(false);
            setVersionsOpen(state !== undefined ? state : !versionsOpen);
        } else {
            setCommentsOpen(false);
            setVersionsOpen(false);
        }
    }

    useEffect(() => {          
        if (currentFileId) {
            if (!isLoading) {
                (async () => {
                    //console.log("infiniteFIles", infiniteFiles)
                    if (filesData && filesData.pages.length > 0) {
                        if (currentFileId >= 1) {
                            const getIndexFromId = (id:number) => {
                                let foundIndex = -1;
                                filesData.pages.some((page: any) => {
                                    let currentFoundIndex = page.data.findIndex((file: FileType) => file.id === id);
                                    if (currentFoundIndex !== -1) {
                                        foundIndex = currentFoundIndex + page.start;
                                    }
                                    return currentFoundIndex !== -1;
                                })
                                //console.log("found index", id, foundIndex)
                                return foundIndex;
                            }
            
                            const getFileFromIndex = async (index:number) : Promise<FileType | undefined> => {
                                if (index > 0 || index <= filesData.pages[0].count) {
                                    let infiniteFilesData: InfiniteData<FilesResult> | undefined = filesData;
                                    //console.log("comparing index", index, infiniteFiles.data.pages[infiniteFiles.data.pages.length - 1].end)
                                    if (index > filesData.pages[filesData.pages.length - 1].end && (hasNextPage || isFetchingNextPage)) {
                                        //console.log("fetchy fetchy")
                                        let fetchedInfiniteFiles = await fetchNextPage({ cancelRefetch: false });
                                        infiniteFilesData = fetchedInfiniteFiles.data;
                                        console.log("preview nextpage was fetched");
                                    }
                                    let foundFile;
                                    infiniteFilesData?.pages.find((page) => {
                                        if (index >= page.start && index <= page.end) {
                                            return foundFile = page.data[index - page.start]; 
                                        }
                                    })
                                    return foundFile;
                                }
                            }
                            let itemIndex = getIndexFromId(currentFileId);
            
                            setPreviousFileId((await getFileFromIndex(itemIndex - 1))?.id);
                            setNextFileId((await getFileFromIndex(itemIndex + 1))?.id);
                            setActiveFile(await getFileFromIndex(itemIndex));
                        } else if(currentFileId >= 0 && currentFileId < 1) {
                            const getFileFromId = (id:number) => {
                                let foundFile: FileType| undefined;
                                filesData.pages.some((page: any) => {
                                    return foundFile = page.data.find((file: FileType) => file.id === id);
                                })
                                // When file id has changed
                                if(!foundFile && activeFile) {
                                    filesData.pages.some((page: any) => {
                                        return foundFile = page.data.find((file: FileType) => {
                                            if (file.name === activeFile.name) {
                                                if (file.id !== currentFileId) {
                                                    setCurrentFileId(file.id);
                                                }
                                                return true;
                                            }
                                        });
                                    })
                                }

                                return foundFile;
                            }
                            setPreviousFileId(undefined);
                            setNextFileId(undefined);
                            setActiveFile(getFileFromId(currentFileId));
                        }
                    } else {
                        setPreviousFileId(undefined);
                        setNextFileId(undefined);
                        setActiveFile(undefined);
                    }

                })();
            }

        }

    }, [isLoading, filesData, dataUpdatedAt, currentFileId])

    const openPreview = (id: number) => {
        setCurrentFileId(id);
        setModalPreviewOpen(true);
    }

    const closePreview = () => {
        setModalPreviewOpen(false);
        if (onClose) {
            onClose();
        }
    }

    useEffect(() => {
        if (previewId) {
            openPreview(previewId);
        }
    }, [previewId])


    const handlePrevious = () => {
        setCurrentFileId(previousFileId);
    }

    const handleNext = () => {
        setCurrentFileId(nextFileId);
    }

    const handleVersionFile = (file: FileType) => {
        if (activeFile?.version !== file.version) {
            setVersionFile(file);
        } else {
            setVersionFile(undefined);
        }
    }
    
    const previewFile = versionFile || activeFile;

    // Keyboard handlers
    useEffect(() => {
        if (activeFile) {
            const handleKey = (e: any) => {
                if (modalPreviewOpen) {
                    if (e.which === 27) { // ESC
                        e.stopImmediatePropagation();
                        closePreview();
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
    
            document.addEventListener("keyup", handleKey);
    
            return () => {
                // cleanup
                document.removeEventListener("keyup", handleKey);
            }
        }

    }, [activeFile, modalPreviewOpen])

    let previewExt: string = getExtension(previewFile?.name || '');
    let previewIcon: string = getIcon(previewFile?.name || '').icon;

    let previewSrc = previewFile?.preview_url || previewFile?.download_url || '';

    // Let GIF and SVG display raw content
    let animatedImage = previewFile?.preview_format === "image" && (previewExt === ".gif" || previewExt === ".svg");
    if (animatedImage) {
        previewSrc = previewFile?.download_url || '';
    }

    return (
        <>
            {filesData && <Overlay.UI isOpen={modalPreviewOpen} className="wy-dark" closeOnEsc={false} onClose={() => setModalPreviewOpen(false)} style={{overlay: {zIndex: 10000}}}>
                <header className="wy-appbars">
                    <nav className="wy-appbar">
                        <Button.UI onClick={closePreview}><Icon.UI name='close' /></Button.UI>
                        <div className={classNames("wy-appbar-text", { "wy-appbar-text-trashed": activeFile?.is_trashed })}>
                            {activeFile &&
                                <span>{activeFile.name}</span>
                            }

                        </div>
                        <div className="wy-appbar-buttons">
                            {activeFile && <>
                                {activeFile.id >= 1 &&
                                    <Button.UI active={commentsOpen} onClick={() => toggleSidebarTab("comments")} title={`Comments`}>
                                        <Icon.ActiveStack>
                                            <Icon.UI name="comment-outline" />
                                            <Icon.UI name="comment" />
                                        </Icon.ActiveStack>
                                    </Button.UI>
                                }
                                <FileMenu file={activeFile}>
                                    {activeFile.id >= 1 &&
                                        <Dropdown.Item active={versionsOpen} onClick={() => toggleSidebarTab("versions")}><Icon.UI name="backup-restore"/> Versions</Dropdown.Item>
                                    }
                                </FileMenu>                        
                            </>}
                        </div>

                    </nav>
                </header>
                
                <div className="wy-main">
                    <>
                        <aside id="tab-comments" className={classNames("wy-sidebar", { "wy-active": commentsOpen, "wy-maximized": sidebarMaximized })} hidden={!commentsOpen}>
                            <nav className="wy-item">
                                <div className="wy-item-body">
                                    <div className="wy-item-title">Comments</div>
                                </div>
                                <Button.UI onClick={() => toggleSidebarTab("comments", false)}><Icon.UI name='close' /></Button.UI>
                                <button onClick={() => setSidebarMaximized(!sidebarMaximized)} className="wy-sidebar-handle" />
                            </nav>
                            <div className="wy-pane wy-scroll-y">
                                {commentsOpen && activeFile && activeFile.id >= 1 && appId && 
                                    <Comments appId={appId} parentId={activeFile.id} type="files" />
                                }
                            </div>
                        </aside>
                        <aside id="tab-versions" className={classNames("wy-sidebar", { "wy-active": versionsOpen, "wy-maximized": sidebarMaximized  })} hidden={!versionsOpen}>
                            <nav className="wy-item">
                                <div className="wy-item-body">
                                    <div className="wy-item-title">Versions</div>
                                </div>
                                <Button.UI onClick={() => toggleSidebarTab("versions", false)}><Icon.UI name='close' /></Button.UI>
                                <button onClick={() => setSidebarMaximized(!sidebarMaximized)} className="wy-sidebar-handle" />
                            </nav>
                            <div className="wy-pane wy-scroll-y">
                                <div className="wy-pane-body">
                                    {versionsOpen && activeFile && <FileVersions key={"files-versions" + appId + activeFile.id} filesKey={["files", appId]} file={activeFile} onVersionSelect={handleVersionFile} />}
                                </div>
                            </div>
                        </aside>
                    </>
                    <div className="wy-preview">
                        {previewFile &&
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
                                        link={previewFile.external_url}
                                        format={previewFile.is_trashed ? "none" : previewFile.preview_format}
                                        name={previewFile.name}
                                        icon={previewIcon}
                                        width={previewFile.width}
                                        height={previewFile.height}
                                        mediaType={previewFile.media_type}
                                        provider={previewFile.provider}
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

export default PreviewFiles;

