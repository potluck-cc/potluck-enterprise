import React, { memo } from "react";
import Auth from "./Auth";

import "./auth.scss";

function SignIn({ initializeApp = () => {} }) {
  return (
    <div className="auth-container">
      <div className="welcome">
        <p className="title">
          Pot<span className="emphasize">luck</span> Enterprise
        </p>

        <p className="subtitle">Reach your customers with ease.</p>
      </div>

      <Auth initializeApp={initializeApp} />
    </div>
  );
}

export default memo(SignIn);
