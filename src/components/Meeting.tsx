import React from "react";
import Icon from '../ui/Icon';

type Props = {
    id: number,
    title: string
    className?: string
}
const Meeting = ({ id, title, className }: Props) => {

    return (
        <>
            {/* <div className={className}>{title}</div> */}
            <Icon.UI name="zoom" />
            <div className={className}>Zoom meeting</div>
            <input type="hidden" value={id} name="meeting"/>
        </>
    )
}

export default Meeting;