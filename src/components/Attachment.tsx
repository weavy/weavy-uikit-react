import React from "react";
import Icon from "../ui/Icon";
import { fileSizeAsString, getIcon } from "../utils/fileUtilities";
import { prefix as wy } from "../utils/styles";

type Props = {
    previewFormat: string,
    url: string,
    previewUrl: string,
    mediaType: string,
    name: string,
    kind: string,
    size: number,
    provider: string
}

const Attachment = ({ previewFormat, url, previewUrl, mediaType, name, kind, size, provider }: Props) => {
    let fileSize = size > 0 ? fileSizeAsString(size) : null;
    let { icon, color } = getIcon(name, mediaType)
    return (
        <a href={previewUrl || url} className={wy('attachment')} target={"_blank"} title={name}>
            <div className={wy('attachment-icon')} title={kind}><Icon.UI name={icon} color={color} size={2} /></div>
            <div className={wy('attachment-content')}>
                <div className={wy('attachment-title')}>{name}</div>
                {fileSize &&
                    <div className={wy('attachment-meta')} title={fileSize}>{fileSize}</div>
                }
            </div>
        </a>
    );
}

export default Attachment;