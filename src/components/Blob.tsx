import classNames from "classnames";
import React from "react";
import Icon from "../ui/Icon";
import { getExtension, getIcon, getKind } from "../utils/fileUtilities";
import { toKebabCase } from "../utils/utils";

type Props = {
    id: number,
    name: string
    className?: string,
    children?: React.ReactNode
}
const Blob = ({ id, name, className, children }: Props) => {
    let ext = getExtension(name);
    let { icon } = getIcon(name);
    let kind = getKind(name)
    return (
        <div className='wy-item'>
            <Icon.UI name={icon} size={24} className={classNames("wy-kind-" + toKebabCase(kind), "wy-ext-" + ext.substring(1))} />
            <div className='wy-item-body'>
                {name}
            </div>
            {children}
        </div>      
    )
}

export default Blob;