import React from "react";
import { Button } from "react-bootstrap";
import "./homeScreen.css";

import PropTypes from "prop-types";
export default function HomeScreen({ startVideoChat }) {
  return (
    <>
      <div className="card-chat home-screen text-center">
        <h1 id="HSHeead" className="text-white video-head">
          Makai Video Conferencing
        </h1>
        <div className="video-actions">
          <Button
            className="homeScreen-Button"
            type="submit"
            onClick={startVideoChat}
          >
            Start New Meeting
          </Button>
          <h3 className="homescreen-h2 text-white mt-3">OR</h3>
          <h4 className="homescreen-h4 text-white mt-3">
            JOIN A MEETING ROOM BELOW
          </h4>
        </div>
      </div>
    </>
  );
}
HomeScreen.propTypes = {
  startVideoChat: PropTypes.func.isRequired,
};
