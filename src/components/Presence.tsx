import React from "react";
import { prefix as wy } from "../utils/styles";

type Props = {
    id: number,
    status: string
}

const Presence = ({ id, status }: Props) => {
    return (
        <span className={wy(`presence ${status === "active" ? "presence-active" : ""}`)} data-presence-id={id}></span>
    )
} 

export default Presence;   