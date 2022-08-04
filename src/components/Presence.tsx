import React from "react";
import classNames from "classnames";

type Props = {
    id: number,
    status: string
}

const Presence = ({ id, status }: Props) => {
    return (
        <span className={classNames("wy-presence", { "wy-presence-active": status === "active" })} data-presence-id={id}></span>
    )
} 

export default Presence;   