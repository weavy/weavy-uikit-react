import classNames from "classnames";
import React from "react";
import Icon from "../ui/Icon";
import { fileSizeAsString, getExtension, getIcon, getKind, getProvider } from "../utils/fileUtilities";
import { toKebabCase } from "../utils/utils";

type Props = {
    previewFormat: string,
    url?: string,
    previewUrl?: string,
    mediaType: string,
    name: string,
    kind: string,
    size?: number,
    provider?: string,
    onClick?: (e: any) => void
}

const Attachment = ({url, previewUrl, name,size, provider, onClick }: Props) => {
    let fileSize = size && size > 0 ? fileSizeAsString(size) : null;
    //let { icon, color } = getIcon(name, mediaType);
    let ext = getExtension(name);
    let { icon } = getIcon(name);
    let kind = getKind(name);
    let prov = getProvider(provider);

    return (
        <a href={previewUrl || url} className="wy-item wy-item-lg" target={"_blank"} title={name} onClick={onClick ? (e) => onClick(e) : undefined}>
            <Icon.UI name={icon + (prov ? `+${prov}` : "")} size={48} className={classNames("wy-kind-" + toKebabCase(kind), "wy-ext-" + ext.substring(1))} />
            <div className="wy-item-body ">
                <div className="wy-item-title">{name}</div>
                {fileSize &&
                    <div className="wy-item-text" title={fileSize}>{fileSize}</div>
                }
            </div>
        </a>
    );
}

export default Attachment;