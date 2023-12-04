import React, { ReactNode, useEffect, useState } from "react";
import Icon from "../ui/Icon";
import Dropdown from "../ui/Dropdown";
import classNames from "classnames";
import dayjs from 'dayjs';
import { fileSizeAsString, getExtension, getIcon, isOfficeDocument } from "../utils/fileUtilities";
import { toKebabCase } from "../utils/utils";
import Spinner from "../ui/Spinner";
import openUrl from "../utils/openUrl";
import { AppFeatures, FileType } from "../types/types";
import { Feature, hasFeature } from "../utils/featureUtils";

type FileProps = {
    file: FileType,
    className?: string,
    onClick?: (e: any) => void
    onRename?: (name: string, file: FileType) => void,
    isRenaming?: boolean,
    onSubscribe?: (file: FileType) => void,
    onUnsubscribe?: (file: FileType) => void,
    onTrash?: (file: FileType) => void,
    onRestore?: (file: FileType) => void,
    onDeleteForever?: (file: FileType) => void,
    onHandleError?: (file: FileType) => void,
    statusText?: string,
    title?: string,
    features: string[],
    appFeatures: AppFeatures | undefined,
    children?: React.ReactNode
}

export const triggerDownload = (file: FileType) => {
    openUrl(file.download_url, "_top", file.name, true);
}

export const triggerExternal = (file: FileType) => {
    openUrl(file?.external_url, "_blank", file.name);
}

export const triggerApplication = (file: FileType) => {
    // TODO: Change to webdav-url
    openUrl(file?.application_url, "_top", file.name);
}

type FileMenuProps = {
    file: FileType,
    className?: string,
    onRename?: (e: any) => void,
    onSubscribe?: (e: any) => void,
    onUnsubscribe?: (e: any) => void,
    onTrash?: (e: any) => void,
    onRestore?: (e: any) => void,
    onDeleteForever?: (e: any) => void,
    children?: ReactNode,
    noWrapper?: boolean,
    features: string[],
    appFeatures: AppFeatures | undefined,
    props?: React.HTMLAttributes<HTMLSpanElement>
}

export const FileMenu = ({ file, className, onRename, onSubscribe, onUnsubscribe, onTrash, onRestore, onDeleteForever, children, noWrapper, features, appFeatures, ...props }: FileMenuProps) => {
    let { icon } = getIcon(file.name);

    let isNotTemp = file.id >= 1;

    return (
        <Dropdown.UI directionX='left' className={className} disabled={file.status && file.status !== "ok"} noWrapper={noWrapper} {...props}>
            {isNotTemp && file.is_trashed && <>
                {onRestore && <Dropdown.Item onClick={onRestore}><Icon.UI name="delete-restore"/>Restore</Dropdown.Item>}
                {onRestore && onDeleteForever && <Dropdown.Divider/>}
                {onDeleteForever && <Dropdown.Item onClick={onDeleteForever}><Icon.UI name="delete-forever"/>Delete</Dropdown.Item>}
            </>}
            {!file.is_trashed && <>
                {file.external_url ?
                    <Dropdown.Item onClick={() => triggerExternal(file)}><Icon.UI name={icon} /> {`Open in ${file.provider}`}</Dropdown.Item>
                : <>
                    { (file.application_url && hasFeature(features, Feature.WebDAV, appFeatures?.webDAV)) &&
                        <Dropdown.Item onClick={() => triggerApplication(file)}><Icon.UI name={file.provider ? toKebabCase(file.provider) : icon } /> {`Open in ${file.provider || 'app'}`}</Dropdown.Item>
                    }
                    <Dropdown.Item onClick={() => triggerDownload(file)}><Icon.UI name="download" size={24} /> Download</Dropdown.Item>
                </>}
                {isNotTemp && <>
                    {onRename && <Dropdown.Item onClick={onRename}><Icon.UI name="textbox" size={24} /> Rename</Dropdown.Item>}
                    {!file.is_subscribed && onSubscribe && <Dropdown.Item onClick={onSubscribe}><Icon.UI name="bell" size={24} /> Subscribe</Dropdown.Item>}
                    {file.is_subscribed && onUnsubscribe && <Dropdown.Item onClick={onUnsubscribe}><Icon.UI name="bell-off" size={24} /> Unsubscribe</Dropdown.Item>}
                    {onTrash && <>
                        <Dropdown.Divider/>
                        <Dropdown.Item onClick={onTrash}><Icon.UI name="delete" size={24} /> Trash</Dropdown.Item>
                    </>}
                </>}
            </>}
            {children}
        </Dropdown.UI>
    );
}

/* Blocks click for a while */
const clickBlock = (callback: React.EventHandler<React.SyntheticEvent>) => {
    return (e: React.SyntheticEvent) => {
        e.preventDefault();
        
        const onClickBlock = (e: Event) => {
            console.debug("Blocked event", e.type);
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // Disable any click for a short while
        document.addEventListener("click", onClickBlock, { once: true, capture: true})

        setTimeout(() => {
            document.removeEventListener("click", onClickBlock, { capture: true})
        }, 500); 

        return callback(e);
    }
}

const FileRow = ({ file, className, onClick, onRename, isRenaming, onSubscribe, onUnsubscribe, onTrash, onRestore, onDeleteForever, onHandleError, statusText, title, features, appFeatures, children }: FileProps) => {
    const [renaming, setRenaming] = useState<boolean>(false);

    useEffect(() => {
        if (isRenaming !== undefined) {
            setRenaming(isRenaming);
        }
    }, [isRenaming]);

    let fileSize = file.size && file.size > 0 ? fileSizeAsString(file.size) : null;
    const fileChangedAt = file.modified_at || file.created_at;
    const fileDate = dayjs.utc(fileChangedAt).tz(dayjs.tz.guess());

    let { icon } = getIcon(file.name);
    let ext = getExtension(file.name);

    const onClickWrapper = (e: React.MouseEvent) => {
        if (!e.defaultPrevented) {
            if (onHandleError && (file.status === "conflict" || file.status === "error")) {
                onHandleError(file);
            } else if (onClick) {
                onClick(e);
            }
        }
    }

    const handleRename = (e: React.SyntheticEvent) => {
        let renameTarget = e.target as HTMLInputElement;
        if (renameTarget.value && renameTarget.value !== file.name) {
            onRename!(renameTarget.value, file);
        }
        setRenaming(false);
    };

    const handleRenameKey = (e: any) => { 
        if (e.key === "Escape") {
            e.preventDefault();
            e.target.value = file.name;
            e.target.blur();
        } else if(e.key === "Enter") {
            e.preventDefault();
            handleRename(e);
        }
    };


    return (
        <tr className={classNames({ "wy-table-trashed": file.is_trashed }, className)} onClick={onClickWrapper} title={title}>
            <td className="wy-table-cell-icon">{
                file.status === "error" ? <Icon.UI name="alert-octagon" color="error" size={24} title={file.statusText || statusText} /> :
                file.status === "conflict" ? <Icon.UI name="alert" color="yellow" size={24} title={file.statusText || statusText} /> :
                file.status === "pending" ? <Spinner.UI spin={!file.progress} progress={file.progress} /> :
                <Icon.UI name={icon} size={24} className={classNames("wy-kind-" + toKebabCase(file.kind), "wy-ext-" + ext.substring(1))} />
            }</td>
            <td>{renaming && onRename ? <>
                <input 
                    type="text"
                    maxLength={256}
                    className="wy-input" 
                    defaultValue={file.name} 
                    onBlur={clickBlock(handleRename)} 
                    onKeyUp={handleRenameKey}
                    onClick={(e: any) => e.preventDefault()} 
                    onFocus={(e: any) => {
                        const i = e.target.value.lastIndexOf(".");
                        if (i === -1) {
                            e.target.select();
                          } else {
                            e.target.setSelectionRange(0, i);
                          }                            
                    }} 
                    autoFocus />
                </> 
                : 
                <>
                    <span title={file.name + ((statusText || file.statusText) ? `: ${statusText || file.statusText}` : '')}>{file.name}{(statusText || file.statusText) && <>: <em>{statusText || file.statusText}</em></>}</span>
                </>
            }</td>
            <td><time dateTime={fileChangedAt} title={fileDate.format('LLLL')}>{fileDate.format('l')}</time></td>
            <td><span>{file.kind}</span></td>
            <td><span>{fileSize}</span></td>
            <td className="wy-table-cell-icon">
                {children || <>
                    <FileMenu 
                        file={file} 
                        onRename={onRename ? () => setRenaming(true) : undefined} 
                        onSubscribe={onSubscribe?.bind(FileRow, file)}
                        onUnsubscribe={onUnsubscribe?.bind(FileRow, file)}
                        onTrash={onTrash?.bind(FileRow, file)}
                        onRestore={onRestore?.bind(FileRow, file)}
                        onDeleteForever={onDeleteForever?.bind(FileRow, file)}
                        noWrapper={true}
                        features={features}
                        appFeatures={appFeatures}
                    /> 
                </>}
            </td>
        </tr>
    )
}

const FileCard = ({ file, className, onClick, onRename, isRenaming, onSubscribe, onUnsubscribe, onTrash, onRestore, onDeleteForever, onHandleError, statusText, title, features, appFeatures, children }: FileProps) => {
    const [renaming, setRenaming] = useState<boolean>(false);

    useEffect(() => {
        if (isRenaming !== undefined) {
            setRenaming(isRenaming);
        }
    }, [isRenaming]);

    let { icon } = getIcon(file.name);
    let ext = getExtension(file.name);

    const onClickWrapper = (e: React.MouseEvent) => {
        if (!e.defaultPrevented && !renaming) {
            if (onHandleError && (file.status === "conflict" || file.status === "error")) {
                onHandleError(file);
            } else if (onClick) {
                onClick(e);
            }
        }
    }

    const handleRename = (e: React.SyntheticEvent) => {
        let renameTarget = e.target as HTMLInputElement;
        if (renameTarget.value && renameTarget.value !== file.name) {
            onRename!(renameTarget.value, file);
        }
        setRenaming(false);
    };

    const handleRenameKey = (e: any) => { 
        if (e.key === "Escape") {
            e.preventDefault();
            e.target.value = file.name;
            e.target.blur();
        } else if(e.key === "Enter") {
            e.preventDefault();
            handleRename(e);
        }
    };

    return (
        <div className={classNames("wy-card", { "wy-card-trashed": file.is_trashed, "wy-card-hover": onClick && !file.is_trashed && !renaming }, className)} onClick={onClickWrapper} title={title}>
            <div className="wy-card-actions">
                {
                    file.status === "error" && <Icon.UI name="alert-octagon" color="error" size={24} title={file.statusText || statusText} /> ||
                    file.status === "conflict" && <Icon.UI name="alert" color="yellow" size={24} title={file.statusText || statusText} /> ||
                    file.status === "pending" && <Spinner.UI spin={!file.progress} progress={file.progress} />
                }
                {children || <>
                    <FileMenu 
                        file={file} 
                        onRename={onRename ? () => setRenaming(true) : undefined} 
                        onSubscribe={onSubscribe?.bind(FileRow, file)}
                        onUnsubscribe={onUnsubscribe?.bind(FileRow, file)}
                        onTrash={onTrash?.bind(FileRow, file)}
                        onRestore={onRestore?.bind(FileRow, file)}
                        onDeleteForever={onDeleteForever?.bind(FileRow, file)}
                        features={features}
                        appFeatures={appFeatures}
                    /> 
                </>}
            </div>
            {!file.is_trashed && file.thumbnail_url &&
                <img className={classNames("wy-card-top wy-card-content", {"wy-card-top-image": file.kind === "image"})} src={file.thumbnail_url} loading="lazy" />
            ||
                <div className="wy-content-icon wy-card-top wy-card-content">
                    <Icon.UI name={icon} size={96} className={classNames("wy-kind-" + toKebabCase(file.kind), "wy-ext-" + ext.substring(1))} />
                </div>
            }
            <div className="wy-card-label wy-card-content wy-filename">
                {renaming && onRename ? <>
                    <input 
                        type="text"
                        maxLength={256}
                        className="wy-input" 
                        defaultValue={file.name} 
                        onBlur={clickBlock(handleRename)} 
                        onKeyUp={handleRenameKey}
                        onClick={(e: any) => e.preventDefault()} 
                        onFocus={(e: any) => {
                            const i = e.target.value.lastIndexOf(".");
                            if (i === -1) {
                                e.target.select();
                              } else {
                                e.target.setSelectionRange(0, i);
                              }                            
                        }} 
                        autoFocus />
                </> : <span title={file.name + ((statusText || file.statusText) ? `: ${statusText || file.statusText}` : '')}>{file.name}{(statusText || file.statusText) && <>: <em>{statusText || file.statusText}</em></>}</span>}
            </div>
        </div>

    )
}

const FileItem = ({ file, className, onClick, onRename, isRenaming, onSubscribe, onUnsubscribe, onTrash, onRestore, onDeleteForever, onHandleError, statusText, title, features, appFeatures, children }: FileProps) => {
    const [renaming, setRenaming] = useState<boolean>(false);

    useEffect(() => {
        if (isRenaming !== undefined) {
            setRenaming(isRenaming);
        }
    }, [isRenaming]);

    let { icon } = getIcon(file.name);
    let ext = getExtension(file.name);

    const onClickWrapper = (e: React.MouseEvent) => {
        if (!e.defaultPrevented && !renaming) {
            if (onHandleError && (file.status === "conflict" || file.status === "error")) {
                onHandleError(file);
            } else if (onClick) {
                onClick(e);
            }
        }
    }

    const handleRename = (e: React.SyntheticEvent) => {
        let renameTarget = e.target as HTMLInputElement;
        if (renameTarget.value && renameTarget.value !== file.name) {
            onRename!(renameTarget.value, file);
        }
        setRenaming(false);
    };

    const handleRenameKey = (e: any) => { 
        if (e.key === "Escape") {
            e.preventDefault();
            e.target.value = file.name;
            e.target.blur();
        } else if(e.key === "Enter") {
            e.preventDefault();
            handleRename(e);
        }
    };

    return (
        <div className={classNames("wy-item", { "wy-item-trashed": file.is_trashed, "wy-item-hover": onClick && !file.is_trashed && !renaming }, className)} onClick={onClickWrapper} title={title}>
            {
                file.status === "error" ? <Icon.UI name="alert-octagon" color="error" size={24} title={file.statusText || statusText} /> :
                file.status === "conflict" ? <Icon.UI name="alert" color="yellow" size={24} title={file.statusText || statusText} /> :
                file.status === "pending" ? <Spinner.UI spin={!file.progress} progress={file.progress} /> :
                <Icon.UI name={icon} size={24} className={classNames("wy-kind-" + toKebabCase(file.kind), "wy-ext-" + ext.substring(1))} />
            }
            <div className="wy-item-body">
                {renaming && onRename ? <>
                    <input 
                        type="text"
                        maxLength={256}
                        className="wy-input" 
                        defaultValue={file.name} 
                        onBlur={clickBlock(handleRename)} 
                        onKeyUp={handleRenameKey}
                        onClick={(e: any) => e.preventDefault()} 
                        onFocus={(e: any) =>  {
                            const i = e.target.value.lastIndexOf(".");
                            if (i === -1) {
                                e.target.select();
                              } else {
                                e.target.setSelectionRange(0, i);
                              }                            
                        }} 
                        autoFocus />
                </> : <span title={file.name + ((statusText || file.statusText) ? `: ${statusText || file.statusText}` : '')}>{file.name}{(statusText || file.statusText) && <>: <em>{statusText || file.statusText}</em></>}</span> }
            </div>
            {children || <>
                <FileMenu 
                    file={file} 
                    onRename={onRename ? () => setRenaming(true) : undefined} 
                    onSubscribe={onSubscribe?.bind(FileRow, file)}
                    onUnsubscribe={onUnsubscribe?.bind(FileRow, file)}
                    onTrash={onTrash?.bind(FileRow, file)}
                    onRestore={onRestore?.bind(FileRow, file)}
                    onDeleteForever={onDeleteForever?.bind(FileRow, file)}
                    features={features}
                    appFeatures={appFeatures}
                /> 
            </>}
        </div>
    )
}

export default { Row: FileRow, Card: FileCard, Item: FileItem, Menu: FileMenu };