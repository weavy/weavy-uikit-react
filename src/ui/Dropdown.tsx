import React, { useEffect, useState } from "react";
import classNames from 'classnames';
import Icon from "./Icon";
import Button from "./Button";
import { prefix as wy } from "../utils/styles";

type DropdownProps = {
    directionX?: "left" | "right";
    directionY?: "up" | "down";
    children: React.ReactNode,
    className?: string,
    props?: React.HTMLAttributes<HTMLSpanElement>
}

const Dropdown = ({ directionX = "right", directionY = "down", children, className = "", ...props }: DropdownProps) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            document.addEventListener("click", () => { setVisible(false) });
        } else {
            document.removeEventListener("click", () => { setVisible(false) });
        }

    }, [visible]);

    const handleMenuClick = (e: any) => {
        e.stopPropagation();
        setVisible(!visible);
    }

    return (
        <span className={classNames(wy("dropdown"), { [wy("dropup")]: directionY === "up" }, className)} {...props}>
            <Button.UI onClick={(e: any) => handleMenuClick(e)} className={wy(classNames({ "active": visible }))}>
                <Icon.UI name="dots-vertical" />
            </Button.UI>

            <div className={wy(classNames("dropdown-menu", { "dropdown-menu-end": directionX === "left" }))} hidden={!visible}>
                {children}
            </div>
        </span>

    )

}
type ItemProps = {
    children: React.ReactNode,
    className?: string,
    onClick?: (e: any) => void,
    props?: React.HTMLAttributes<HTMLDivElement>
}
const DropdownItem = ({ children, className = "", onClick, ...props }: ItemProps) => {
    return <div className={classNames(wy("dropdown-item"), className)} onClick={onClick} {...props}>{children}</div>
}

// Export as replacable UI component
const UIDropdown = { UI: Dropdown, Item: DropdownItem };
export default UIDropdown;