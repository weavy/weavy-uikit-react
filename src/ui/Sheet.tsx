import React, { useEffect, useState } from 'react';
import Modal, { Styles } from 'react-modal';
import classNames from 'classnames';
import Icon from "./Icon";
import Button from "./Button";
import useEvents from '../hooks/useEvents';

type SheetProps = {
    children: React.ReactNode,
    className?: string,
    isOpen: boolean,
    style?: Styles
    title: string,
    onClose?: (e: any) => void
}

const customStyles = {
    content: {
      padding: 0
    },
  };
  
  
  const SheetImpl = ({ children, className = "", isOpen, style, title, onClose }: SheetProps) => {
    const [sheetShowing, setSheetShowing] = useState(false);
    const { dispatch, on, off } = useEvents();

    // Register/unregister close_sheet listener
    useEffect(() => {
      if (onClose) {
        if (sheetShowing) {
          on("close_sheet", onClose);
          
          return () => {
            off("close_sheet", onClose)
          }
        } else {
          off("close_sheet", onClose)
        }
      }
    }, [sheetShowing])


    useEffect(() => {
      if (!isOpen) {
        setSheetShowing(false)
      } else {
        // Close others on open
        dispatch("close_sheet", {})
      }
    }, [isOpen])

    return (
        <Modal
            isOpen={isOpen}
            ariaHideApp={false}
            onAfterOpen={() => { setSheetShowing(true)} }
            onAfterClose={() => { setSheetShowing(false)} }
            onRequestClose={onClose}
            closeTimeoutMS={201}
            className={classNames("wy-sheet", className, {"wy-show": sheetShowing})}
            overlayClassName="wy-viewport"
            contentLabel={title}
            shouldCloseOnOverlayClick={false}
            style={style}
        >
          <div className="wy-appbar">
            <div></div>
            <div className="wy-appbar-text">{title}</div>
            <div className="wy-appbar-buttons">
              {onClose && 
                <Button.UI onClick={(e: any) => onClose(e)} title="Close">
                  <Icon.UI name="close" />
                </Button.UI>
              }
            </div>
          </div>
          <div className="wy-sheet-body wy-scroll-y">
            {children}
          </div>
        </Modal>
    )
}

// Export as replacable UI component
const UISheet = { UI: SheetImpl };
export default UISheet;