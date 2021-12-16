import React from "react";

const Loader = ({
  position="absolute",
  border,
  background = "hsla(224, 13%, 17%, 0.719)",
  small=false
}) => {
  return (
    <div
      className="loader"
      style={{
        position: position,
        borderRadius: border ? border : "0px",
        background:background,
        zIndex:"9"      }}
    >
      <div className="loader-wrapper">
        <svg width="0" height="0">
          <filter id="gooey-black-hole">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="20"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -16"
              result="goo"
            />
          </filter>
        </svg>
        <div className="black-hole">
          <ul className="gooey-container">
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loader;
