import React from 'react';
import classNames from 'classnames';

type SpinnerProps = {
    size?: number,
    spin?: boolean,
    overlay?: boolean
}
  
const SpinnerImpl = ({ spin = true, size = 24, overlay= false }: SpinnerProps) => {
 
    return (
      <svg className={classNames("wy-spinner", {"wy-spin" : spin, "wy-spinner-overlay" : overlay })} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle fill="none" cx="12" cy="12" r="11" strokeLinecap="butt" strokeWidth="2" /></svg>
    )
}

// Export as replacable UI component
const UISpinner = { UI: SpinnerImpl };
export default UISpinner;