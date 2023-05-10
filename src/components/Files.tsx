import React, { useState, useContext, useEffect, useCallback } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import { FilesProps } from '../types/Files';
import useFiles from '../hooks/useApps';
import classNames from 'classnames';
import FileList from './FileList';
import Dropdown from '../ui/Dropdown';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Sheet from '../ui/Sheet';
import FileItem from './FileItem';
import useCloudFiles from '../hooks/useCloudFiles';
import { useMutateFileUpload, useMutateFileCreate, useMutatingFileUploads, useRemoveMutatingFileUpload, CreateFileProps, FileMutation } from '../hooks/useMutateFile';
import { useMutateFilesCreate } from '../hooks/useMutateFiles';
import { useSessionState } from '../hooks/useSessionState';
import { useMutateAppsSubscribe } from '../hooks/useMutateApps';
import openUrl from '../utils/openUrl';
import { useDropzone } from 'react-dropzone';
import { BlobType, FileOrder, FileType, FileView } from '../types/types';
import useFeatures from '../hooks/useFeatures';
import { Feature, hasFeature } from '../utils/featureUtils';

const Files = ({
    uid,
    className,
    view: initView = "list",
    order: initOrder = { by: "name", descending: false },
    trashed: initTrashed = false,
    features
}: FilesProps) => {

    const { client } = useContext(WeavyContext);
    const [appId, setAppId] = useState<number>();
    const [selectedFiles, setSelectedFiles] = useState<string>("");

    if (!client) {
        throw new Error('Weavy Files component must be used within an WeavyProvider');
    }

    // init app
    const { isLoading, data } = useFiles(uid, {});
    const { isLoading: isLoadingFeatures, data: dataFeatures } = useFeatures("files", {});

    const mutateFilesSubscribe = useMutateAppsSubscribe(["apps", uid]);

    const [showUploadDetails, setShowUploadDetails] = useState<boolean>(false);

    const createFile = useMutateFilesCreate(appId!);
    const uploadFileMutation = useMutateFileUpload(['files', appId!], createFile);
    const createFileMutation = useMutateFileCreate(['files', appId!], createFile);
    const { mutations, status, progress } = useMutatingFileUploads(['files', appId!]);
    const removeMutatingFileUpload = useRemoveMutatingFileUpload(['files', appId!]);

    let fileInput: HTMLInputElement | null;

    const [view, setView] = useSessionState<FileView>(`files-view-${uid}`, initView);
    const [order, setOrder] = useSessionState<FileOrder>(`files-order-${uid}`, initOrder);
    const [showTrashed, setShowTrashed] = useSessionState<boolean>(`files-trashed-${uid}`, initTrashed);

    useEffect(() => {
        if (data) {
            setAppId(data.id);
        } else {
            setAppId(undefined);
        }
    }, [data]);

    useEffect(() => {
        if (status === "error" || status === "conflict") {
            setShowUploadDetails(true);
        }
        if (mutations.length === 0) {
            setShowUploadDetails(false)
        }
    }, [status, mutations.length])

    // add external file
    const handleExternalFileAdded = (addedBlobs: BlobType[]) => {
        addedBlobs.forEach((blob) => handleCreateFile(blob));
    }

    const { openCloudFiles } = useCloudFiles(handleExternalFileAdded);

    const handleSubscribe = (subscribe: boolean) => {
        if (appId) {
            mutateFilesSubscribe.mutateAsync({ appId, subscribe })
        }
    }

    // add uploaded files
    const handleCreateFile = async (blob: BlobType, file?: FileType, replace?: boolean) => {
        let fileProps: CreateFileProps = { blob, file, replace };
        await createFileMutation.mutateAsync(fileProps, {
            onSuccess: (data: FileType) => {
                //console.log("All cloud files added")
            }
        });
    }

    // upload files
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            for (var i = 0; i < e.target.files.length; i++) {
                let file = e.target.files[i];
                let fileProps = { file: file }
                uploadFileMutation.mutateAsync(fileProps, {
                    onSuccess: (data: BlobType) => {
                        //console.log("All files uploaded")
                    }
                });
            }
            setSelectedFiles("")
        }
    }

    // open file dialog
    const openFileInput = (e: any) => {
        //console.log("click")
        fileInput?.click();
    }

    // remove file attachment
    const handleRemoveUpload = (mutation: FileMutation) => {
        removeMutatingFileUpload(mutation);
    }

    const handleOverwriteUpload = (mutation: FileMutation) => {
        removeMutatingFileUpload(mutation);

        let fileBlob = mutation.state.context?.blob;
        if (fileBlob) {
            handleCreateFile(fileBlob, mutation.state.context?.file, true);
        }
    }
    // Pasted file(s)


    const handleDownloadArchive = () => {
        if (appId && data && data.archive_url) {
            //const archiveUrl = new URL(`/api/apps/${appId}/files.zip`, client.url).toString();
            openUrl(data.archive_url, "_top", `${uid}.zip`, true);
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
        if (acceptedFiles.length > 0) {
            for (var i = 0; i < acceptedFiles.length; i++) {
                let file = acceptedFiles[i];
                let fileProps = { file: file }
                uploadFileMutation.mutateAsync(fileProps, {});
            }
            return true;
        }

    }, []);

    const { getRootProps, rootRef: pasteRef, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        disabled: !appId
    });

    // Pasted file(s)
    const handlePaste = (evt: any) => {
        console.debug("File(s) pasted");
        let files: File[] = [];
        const items = (evt.clipboardData || evt.originalEvent.clipboardData).items;
        for (let index in items) {
            const item = items[index];
            if (item.kind === 'file') {
                files = [...files, item.getAsFile()];
            }
        }
        if (files.length) {
            for (var i = 0; i < files.length; i++) {
                let file = files[i];
                let fileProps = { file: file }
                uploadFileMutation.mutateAsync(fileProps, {
                    onSuccess: (data: BlobType) => {
                        //console.log("All files uploaded")
                    }
                });
            }
        }
    }

    const delegateHandlePaste = (evt: any) => {
        if (pasteRef.current) {
            var targ = evt.target;
            do {
                if (pasteRef.current === targ) {
                    handlePaste(evt);
                }
            } while ((targ = targ.parentNode) && targ !== evt.currentTarget);
        }
    }

    useEffect(() => {
        if (appId) {
            document.addEventListener("paste", delegateHandlePaste);
            return () => {
                document.removeEventListener("paste", delegateHandlePaste);
            }
        }
    }, [appId])

    if (!isLoading && !data) {
        return <div>No files app with the contextual id <strong>{uid}</strong> was found.</div>;
    }
    
    return (
        <>
            {appId && dataFeatures &&
                <div className={classNames("wy-files", className, { "wy-files-dragging": isDragActive })} {...getRootProps()}>
                    <header className="wy-appbars">
                        <nav className="wy-toolbar">

                            <div className="wy-toolbar-buttons">
                                {(hasFeature(dataFeatures, Feature.Attachments, features?.attachments) || hasFeature(dataFeatures, Feature.CloudFiles, features?.cloudFiles)) &&
                                    <Dropdown.UI title="Add files" disabled={!appId} buttonContent={
                                        <><span>Add files</span><Icon.UI name="plus" /></>
                                    }>
                                        {hasFeature(dataFeatures, Feature.Attachments, features?.attachments) &&
                                            <>
                                                <Dropdown.Item onClick={openFileInput}><Icon.UI name="attachment" /> From device</Dropdown.Item>
                                                <input type="file" value={selectedFiles} ref={input => fileInput = input} onChange={handleFileUpload} multiple hidden tabIndex={-1} />
                                            </>
                                        }
                                        {hasFeature(dataFeatures, Feature.CloudFiles, features?.cloudFiles) &&
                                            <Dropdown.Item onClick={openCloudFiles}><Icon.UI name="cloud" /> From cloud</Dropdown.Item>
                                        }
                                    </Dropdown.UI>
                                }

                            </div>

                            <div className="wy-toolbar-buttons wy-toolbar-buttons-last">
                                {mutations.length > 0 && <Button.UI onClick={() => setShowUploadDetails(!showUploadDetails)}>
                                    {
                                        status === "conflict" ? <Icon.UI name="alert" color="yellow" title="File conflict" /> :
                                            status === "error" ? <Icon.UI name="alert-octagon" color="error" title="Upload error" /> :
                                                status === "pending" ? <Spinner.UI spin={progress === undefined} progress={progress} /> :
                                                    <Icon.UI name="check" title='All uploads finished' />
                                    }
                                </Button.UI>}
                                <Sheet.UI title={"Uploads"} isOpen={showUploadDetails} onClose={() => setShowUploadDetails(false)}>
                                    {mutations.map((mutation) => {
                                        let file = mutation.state.context?.file;
                                        if (file) {
                                            return (
                                                <FileItem.Item key={"file-mutation" + mutation.mutationId} features={dataFeatures} appFeatures={features} file={file} statusText={file.status === "conflict" ? "Replace existing file?" : ''} title={file.name + (file.statusText ? `: ${file.statusText}` : '')}>
                                                    <div className='wy-item-actions'>
                                                        {file.status === "conflict" && <>
                                                            <Button.UI onClick={handleOverwriteUpload.bind(Files, mutation)} title="Replace"><Icon.UI name='check' /></Button.UI>
                                                        </>}
                                                        <Button.UI onClick={handleRemoveUpload.bind(Files, mutation)} title="Discard"><Icon.UI name='close' /></Button.UI>
                                                    </div>
                                                </FileItem.Item>
                                            )
                                        }
                                        return undefined;
                                    })}
                                </Sheet.UI>

                                <Dropdown.UI icon="sort" title="Sort items by" directionX='left'>
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": order.by === "name" })} onClick={(e: any) => setOrder({ ...order, by: "name" })}><Icon.UI name="check" /> Name</Dropdown.Item>
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": order.by === "modified_at" })} onClick={(e: any) => setOrder({ ...order, by: "modified_at" })}><Icon.UI name="check" /> Modified</Dropdown.Item>
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": order.by === "size" })} onClick={(e: any) => setOrder({ ...order, by: "size" })}><Icon.UI name="check" /> Size</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": !order.descending })} onClick={(e: any) => setOrder({ ...order, descending: false })}><Icon.UI name="check" /> Ascending</Dropdown.Item>
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": order.descending })} onClick={(e: any) => setOrder({ ...order, descending: true })}><Icon.UI name="check" /> Descending</Dropdown.Item>
                                </Dropdown.UI>

                                <Dropdown.UI icon={view === "grid" ? "view-module-outline" : "view-list-outline"} title="View options" directionX='left'>
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": view === "list" })} onClick={(e: any) => setView("list")}><Icon.UI name="check" /> List view</Dropdown.Item>
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": view === "grid" })} onClick={(e: any) => setView("grid")}><Icon.UI name="check" /> Grid view</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": !showTrashed })} onClick={(e: any) => setShowTrashed(false)}><Icon.UI name="check" /> Hide trashed</Dropdown.Item>
                                    <Dropdown.Item className={classNames("wy-option", { "wy-selected": showTrashed })} onClick={(e: any) => setShowTrashed(true)}><Icon.UI name="check" /> Show trashed</Dropdown.Item>
                                </Dropdown.UI>

                                <Dropdown.UI directionX='left' disabled={isLoading || !data}>
                                    {data && <>
                                        {data.is_subscribed ?
                                            <Dropdown.Item onClick={() => handleSubscribe(false)}><Icon.UI name="bell-off" /> Unsubscribe</Dropdown.Item>
                                            :
                                            <Dropdown.Item onClick={() => handleSubscribe(true)}><Icon.UI name="bell" /> Subscribe</Dropdown.Item>
                                        }
                                        {data.archive_url &&
                                            <Dropdown.Item onClick={() => openUrl(data.archive_url, "_top", `${uid}.zip`, true)}><Icon.UI name="download" /> Download files</Dropdown.Item>
                                        }

                                    </>}
                                </Dropdown.UI>

                            </div>

                        </nav>
                    </header>

                    <FileList appId={appId} view={view} order={order} trashed={showTrashed} onSorting={(sortOrder) => setOrder(sortOrder)} onHandleError={(errorFile) => setShowUploadDetails(true)} features={dataFeatures} appFeatures={features}/>
                </div>
            }
        </>




    )
}

export default Files;