import React from "react";
import Icon from "../ui/Icon";
import { fileSizeAsString, getIcon } from "../utils/fileUtilities";

type Props = {
    previewFormat: string,
    url: string,
    previewUrl: string,
    mediaType: string,
    name: string,
    kind: string,
    size: number,
    provider: string,
    onClick?: (e: any) => void
}

const Attachment = ({ previewFormat, url, previewUrl, mediaType, name, kind, size, provider, onClick }: Props) => {
    let fileSize = size > 0 ? fileSizeAsString(size) : null;
    let { icon, color } = getIcon(name, mediaType)
    return (
        <a href={previewUrl || url} className="wy-item wy-item-hover wy-item-lg wy-attachment" target={"_blank"} title={name} onClick={onClick ? (e) => onClick(e) : undefined}>
            <Icon.UI name={icon} color={color} size={2} />
            <div className="wy-item-body wy-attachment-content">
                <div className="wy-item-title wy-attachment-title">{name}</div>
                {fileSize &&
                    <div className="wy-item-text wy-attachment-meta" title={fileSize}>{fileSize}</div>
                }
            </div>
        </a>
    );
}

export default Attachment;