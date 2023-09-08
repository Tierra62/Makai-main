import React, { useState, useCallback, useMemo } from "react";
import {
  useParticipantIds,
  useScreenShare,
  useLocalParticipant,
  useDailyEvent,
} from "@daily-co/daily-react-hooks";
import { Button } from "react-bootstrap";
import "./call.css";
import Tile from "../tilevideo/TileVideo";
import UserMediaError from "../usermediaerror/UserMediaError";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function Call() {
  /* If a participant runs into a getUserMedia() error, we need to warn them. */
  const [getUserMediaError, setGetUserMediaError] = useState(false);

  /* We can use the useDailyEvent() hook to listen for daily-js events. Here's a full list
   * of all events: https://docs.daily.co/reference/daily-js/events */
  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, [])
  );

  const [currentUrl, setCurrentLocation] = useState({ url: null, show: false });

  /* This is for displaying remote participants: this includes other humans, but also screen shares. */
  const { screens } = useScreenShare();
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });

  const handleCopyClick = () => {
    /*Use of windows.location approved by instructor on Q*/
    setCurrentLocation((prevState) => {
      const newState = { ...prevState };
      newState.url = window.location.toString();
      newState.show = true;
      return newState;
    });
    Toastify({
      text: "Link Copied To Clipboard",
      className: "Success",
      style: {
        background: "linear-gradient(to right, green)",
      },
    }).showToast();
    const textarea = document.createElement("textarea");
    textarea.value = window.location.toString();
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  /* This is for displaying our self-view. */
  const localParticipant = useLocalParticipant();
  const isAlone = useMemo(
    () => remoteParticipantIds?.length < 1 || screens?.length < 1,
    [remoteParticipantIds, screens]
  );

  const renderCallScreen = () => (
    <div
      className={`${
        screens.length > 0
          ? "is-screenshare card call card showcase-page-gradient"
          : "card call call card showcase-page-gradient"
      }`}
    >
      {/* Your self view */}
      {localParticipant && (
        <Tile id={localParticipant.session_id} isLocal isAlone={isAlone} />
      )}
      {/* Videos of remote participants and screen shares */}
      {remoteParticipantIds?.length > 0 || screens?.length > 0 ? (
        <>
          {remoteParticipantIds.map((id) => (
            <Tile key={id} id={id} />
          ))}
          {screens.map((screen) => (
            <Tile key={screen.screenId} id={screen.session_id} isScreenShare />
          ))}
        </>
      ) : (
        // When there are no remote participants or screen shares
        <div className="call-container " id="call-window">
          <div className="info-box card-card bg-grey" id="wait-card">
            <h1 className="waiting-h1">Waiting for others</h1>
            <p className="text-100">Invite someone by sharing the link:</p>
            <Button
              className="copy-button mt-3"
              variant="warning"
              onClick={handleCopyClick}
            >
              Generate & Copy Link
            </Button>
            <div className="copy-container text-100 mt-3">
              {currentUrl.show && (
                <span className="room-url">{currentUrl.url}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return getUserMediaError ? <UserMediaError /> : renderCallScreen();
}
