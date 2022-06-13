import React from "react";
import Icon from "../ui/Icon";

type Props = {
    id: number,
    name: string
    className?: string,
    icon: string
}
const File = ({ id, name, className, icon }: Props) => {

    return (
        <>
            <Icon.UI name={icon} size={1} />
            <div className={className}>{name}</div>
            <input type="hidden" value={id} name="blob"/>
        </>
    )
}

export default File;