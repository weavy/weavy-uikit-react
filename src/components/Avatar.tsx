import React from "react";
import classNames from 'classnames';
import Presence from "./Presence";
import { prefix as wy } from "../utils/styles";

type Props = {
    id?: number,
    name: string,
    src: string
    presence?: string,
    size?: number,
    className?: string
}

const Avatar = ({ id, src, name, presence, size = 48, className }: Props) => {
    return (
        <div className={classNames(wy('avatar-presence'), className)}>
            <img alt="" title={name} className={wy('avatar')} height={size} width={size} src={src} />
            {presence && id &&
                <Presence id={id} status={presence} />
            }
        </div>
    )
}

export default Avatar;