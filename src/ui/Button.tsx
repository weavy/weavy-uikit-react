import React, { Children } from "react";
import Icon from "./Icon";
import classNames from "classnames";
import Spinner from "./Spinner";

type Props = {
    active?: boolean,
    type?: "button" | "submit" | "reset",
    onClick?: (e: any) => void,
    className?: string,
    children?: React.ReactNode,
    props?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

const Button: any = React.forwardRef(({ active = false, type = "button", onClick, className = "", children, ...props }: Props, ref: React.LegacyRef<HTMLButtonElement> | undefined) => {
    let singleChild: any = Children.count(children) === 1 && Children.toArray(children).pop();

    let buttonClassNames = classNames(
        "wy-button", 
        className,
        {
            "wy-active": active,
            "wy-button-icon": singleChild?.type === Icon.UI || singleChild?.type === Icon.ActiveStack || singleChild?.type === Spinner.UI
        }
    );

    return <button ref={ref} type={type} className={buttonClassNames} onClick={onClick} { ...props }>{children}</button>
});

// Export as replacable UI component
const UIButton = { UI: Button };
export default UIButton;