import React, { useContext, useEffect, useState } from 'react';
import { triggerDownload } from './FileItem';
import useFileVersions from '../hooks/useFileVersions';
import classNames from 'classnames';
import Icon from '../ui/Icon';
import { getExtension, getIcon } from '../utils/fileUtilities';
import Dropdown from '../ui/Dropdown';
import { useMutateFileVersionDelete, useMutateFileVersionRestore } from '../hooks/useMutateFileVersion';
import { QueryKey } from 'react-query';
import { toKebabCase } from '../utils/utils';
import Spinner from '../ui/Spinner';
import dayjs from 'dayjs';
import { FileType } from '../types/types';


type Props = {
    filesKey: QueryKey,
    file: FileType,
    onVersionSelect?: (currentVersionFile: FileType) => void
}

const FileVersions = ({ filesKey, file, onVersionSelect }: Props) => {    
    const fileVersionList = useFileVersions(filesKey, file.id, {});
    const { isLoading, isError, data, error, isFetching } = fileVersionList;

    const mutateFileVersionRestore = useMutateFileVersionRestore(filesKey);
    const mutateFileVersionDelete = useMutateFileVersionDelete(filesKey);

    const [activeVersion, setActiveVersion] = useState<FileType>()

    useEffect(() => {
        setActiveVersion(file);
    }, [file, file.version])


    const handleSelect = (versionFile: FileType) => {
        setActiveVersion(versionFile);
        onVersionSelect && onVersionSelect(versionFile);
    }

    const handleSelectWrapper = (versionFile: FileType, e: React.MouseEvent<HTMLTableRowElement>) => {
        if (!e.defaultPrevented) {
            handleSelect(versionFile);
        }
    }

    const handleRevert = (versionFile: FileType) => {
        console.log("reverting file version", versionFile.version);
        mutateFileVersionRestore.mutate({versionFile});
        handleSelect(versionFile);
    }

    const handleRemove = (versionFile: FileType) => {
        console.log("removing file version", versionFile.version);
        mutateFileVersionDelete.mutate({versionFile});
        if (activeVersion === versionFile) {
            setActiveVersion(file);
        }
    }

    if (isLoading) {
        return (
            <Spinner.UI spin={true} overlay={true} />
        )
    }

    return (
        <div className="wy-list wy-versions" key={"file-versions" + file.id}>
            {data && data.map((versionFile: FileType, index) => {
                let versionIcon = getIcon(versionFile.name || '').icon;
                let num = data.length - index;
                let ext = getExtension(versionFile.name);
                const modifiedAt = dayjs.utc(versionFile.modified_at || versionFile.created_at).tz(dayjs.tz.guess());

                return <div key={'file-version' + versionFile.version} className={classNames("wy-item wy-item-hover wy-item-lg", {"wy-active": versionFile.version == activeVersion?.version})} onClick={handleSelectWrapper.bind(FileVersions, versionFile)}>
                    {
                        file.status === "error" ? <Icon.UI name="alert-octagon" color="error" size={48} /> :
                        file.status === "conflict" ? <Icon.UI name="alert" color="yellow" size={48} /> :
                        file.status === "pending" ? <Spinner.UI spin={!versionFile.progress} progress={versionFile.progress} size={48} /> :
                        <Icon.UI name={versionIcon} size={48} className={classNames("wy-kind-" + toKebabCase(versionFile.kind), "wy-ext-" + ext.substring(1))} />
                    }
                    <div className="wy-item-body">
                        <div className="wy-item-title">{num}. {versionFile.name}</div>
                        <div className="wy-item-text"><time dateTime={versionFile.modified_at || versionFile.created_at} title={modifiedAt.format('LLLL')}>{modifiedAt.fromNow()}</time> · {versionFile.modified_by?.display_name}</div>
                    </div>
                
                    <Dropdown.UI directionX='left'>
                        <Dropdown.Item onClick={() => triggerDownload(versionFile)}><Icon.UI name="download" /> Download</Dropdown.Item>
                        {versionFile.version !== file.version && <>
                            <Dropdown.Divider/>
                            <Dropdown.Item onClick={() => handleRevert(versionFile)}><Icon.UI name='restore' /> Revert</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleRemove(versionFile)}><Icon.UI name='delete' /> Remove</Dropdown.Item>
                        </>}
                    </Dropdown.UI>
                </div>
            })}    
        </div>
     )
}

export default FileVersions;