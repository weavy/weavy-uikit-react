import React, { useState } from 'react';
import Modal, { Styles } from 'react-modal';
import classNames from 'classnames';

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
            className={classNames("wy-panel wy-overlay wy-transition", className, {"wy-open": modalShowing})}
            overlayClassName="wy-overlays wy-viewport"
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