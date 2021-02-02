import React from "react";

const ActorPreloaderCard = () => {
  return (
    <div className="actor-card actor-preloader-card">
      <div className="actor-card-body">
        <div className="img-wrap">
        </div>
        <div className="card-right">
          <div className="name-wrapper">
          <div className="text-preloader preloader-name"></div>
            <div className="stripe"></div>
          </div>
          <div className="text-preloader-container">
            <div className="text-preloader"></div>
            <div className="text-preloader"></div>
            <div className="text-preloader"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPreloaderCard;
