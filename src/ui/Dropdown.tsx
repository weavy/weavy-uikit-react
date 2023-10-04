import React, { useEffect, useState } from "react";
import classNames from 'classnames';
import Icon from "./Icon";
import Button from "./Button";
import { usePopper } from 'react-popper';

type DropdownProps = {
    directionX?: "left" | "right";
    directionY?: "up" | "down";
    icon?: string,
    children: React.ReactNode,
    className?: string,
    title?: string,
    buttonContent?: React.ReactNode,
    disabled?: boolean,
    noWrapper?: boolean,
    props?: React.HTMLAttributes<HTMLSpanElement>,
}

const Dropdown = ({ directionX = "right", directionY = "down", icon = "dots-vertical", children, className = "", title = "", buttonContent, disabled = false, noWrapper, ...props }: DropdownProps) => {
    const [visible, setVisible] = useState<boolean>(false);

    const placement = 
        directionX === "right" && directionY === "down" ? "bottom-start" :
        directionX === "left" && directionY === "down" ? "bottom-end" :
        directionX === "right" && directionY === "up" ? "top-start" :
        "top-end";

    const [referenceElement, setReferenceElement] = useState<HTMLButtonElement|null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement|null>(null);
    const { styles, attributes, update } = usePopper(visible ? referenceElement : undefined, visible ? popperElement : undefined, { placement: placement, modifiers: [{ name: "offset", options: {offset: [0, 5]}}] });

    const documentClickHandler = () => { 
        setVisible(false);
    };

    useEffect(() => {
        update?.();

        setTimeout(() => {
            if (visible) {
                document.addEventListener("click", documentClickHandler, { once: true });
            } else {
                document.removeEventListener("click", documentClickHandler);
            }
        })

    }, [visible]);

    const handleMenuClick = (e: any) => {
        e.preventDefault();
        setVisible(!visible);
    }

    return (
        <span className={classNames({"wy-dropdown": !noWrapper, "wy-dropup": !noWrapper && directionY === "up" }, className)} {...props}>
            <Button.UI ref={setReferenceElement} onClick={(e: any) => handleMenuClick(e)} className={classNames({ "wy-active": visible })} title={title} disabled={disabled}>
                {buttonContent || <Icon.UI name={ icon } />}
            </Button.UI>

            <div ref={setPopperElement} className={classNames("wy-dropdown-menu", { "wy-dropdown-menu-end": directionX === "left" })} hidden={!visible} style={styles.popper} {...attributes.popper}>
                {children}
            </div>
        </span>

    )

}

type ItemProps = {
    children: React.ReactNode,
    className?: string,
    onClick?: (e: any) => void,    
    active?: boolean,
    props?: React.HTMLAttributes<HTMLDivElement>
}

type AnchorProps = {
    children: React.ReactNode,
    className?: string,    
    link?: string,
    active?: boolean,
    download?: boolean,
    props?: React.HTMLAttributes<HTMLAnchorElement>
}

const DropdownItem = ({ children, className = "", onClick, active, ...props }: ItemProps) => {
    const onClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    }
    return <div className={classNames("wy-dropdown-item", { "wy-active": active }, className)} onClick={onClickWrapper} {...props}>{children}</div>
}

const DropdownAnchorItem = ({ children, className = "", link, active, download, ...props }: AnchorProps) => {    
    if(download){
        props = {...props, ...{download: true}}
    }
    return <a className={classNames("wy-dropdown-item", { "wy-active": active }, className)} href={link} {...props}>{children}</a>
}

const DropdownDivider = () => <hr className="wy-dropdown-divider"></hr>;

// Export as replacable UI component
const UIDropdown = { UI: Dropdown, Item: DropdownItem, Anchor: DropdownAnchorItem, Divider: DropdownDivider };
export default UIDropdown;