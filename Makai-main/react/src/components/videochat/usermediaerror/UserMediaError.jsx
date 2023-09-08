import "./userMediaError.css";
import React from "react";

const refreshPage = () => {
  window.location.assign(window.location.toString());
};

export default function UserMediaError() {
  return (
    <div className="call">
      <div className="info-box get-user-media-error">
        <h1>Camera or mic blocked</h1>
        <button onClick={refreshPage} type="button">
          Try again
        </button>
        <p>
          <a
            href="https://docs.daily.co/guides/how-daily-works/handling-device-permissions"
            target="_blank"
            rel="noreferrer"
          >
            Get help
          </a>
        </p>
      </div>
    </div>
  );
}
