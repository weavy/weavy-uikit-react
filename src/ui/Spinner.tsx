import React from 'react';
import classNames from 'classnames';

type SpinnerProps = {
    size?: number,
    spin?: boolean,
    overlay?: boolean,
    progress?: number
}
  
const SpinnerImpl = ({ spin = true, size = 24, overlay= false, progress }: SpinnerProps) => {
    var strokeDashoffset = !spin && progress && 100 - progress || undefined;
    return (strokeDashoffset !== undefined ?
      <svg viewBox="0 0 24 24" width={size} height={size} transform="rotate(-90)" data-icon="progress" className="wy-icon wy-icon-primary"><circle cx="12" cy="12" r="10" strokeLinecap="butt" strokeWidth="2" fill="none" stroke="#eee"></circle><circle cx="12" cy="12" r="10" strokeDasharray="100" strokeDashoffset={strokeDashoffset} strokeLinecap="butt" strokeWidth="2" fill="none" stroke="currentColor" pathLength="100"></circle></svg>
      :
      <svg className={classNames("wy-spinner", {"wy-spin" : spin, "wy-spinner-overlay" : overlay })} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle fill="none" cx="12" cy="12" r="11" strokeLinecap="butt" strokeWidth="2" /></svg>
    )
}

// Export as replacable UI component
const UISpinner = { UI: SpinnerImpl };
export default UISpinner;