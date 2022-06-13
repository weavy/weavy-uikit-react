import React, { useState } from 'react';
import Modal, { Styles } from 'react-modal';
import classNames from 'classnames';
import { prefix as wy } from "../utils/styles";

type OverlayProps = {
    children: React.ReactNode,
    className?: string,
    isOpen: boolean,
    style?: Styles
}

const customStyles = {
    content: {
      padding: 0
    },
  };
  
  
  const OverlayImpl = ({ children, className = "", isOpen, style }: OverlayProps) => {
    const [modalShowing, setModalShowing] = useState(false);

    return (
        <Modal
            isOpen={isOpen}
            ariaHideApp={false}
            onAfterOpen={() => { setModalShowing(true)} }
            onRequestClose={() => { setModalShowing(false)}}
            className={classNames(wy("panel overlay transition"), className, {[wy("open")]: modalShowing})}
            overlayClassName={wy('overlays viewport')}
            contentLabel="Example Modal"
            style={style}
        >
          {children}
        </Modal>
    )
}

// Export as replacable UI component
const UIOverlay = { UI: OverlayImpl };
export default UIOverlay;