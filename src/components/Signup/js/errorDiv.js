import React from "react";

export const errorDiv = ({ errorDivRef, errorFrameRef, notifIcon, errorSpanRef }) => {
  return (
    <>
      <div className="error-hover" style={{ display: "flex" }} ref={errorDivRef}>
        <div className="label-frame">
          <div className="input-frame error-div" ref={errorFrameRef}>
            <div className="left-content error-message">
              <img src={notifIcon} alt="" width={25} />
              <span ref={errorSpanRef}>Something went wrong, please try again later.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default errorDiv;
