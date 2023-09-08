import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  useLocalParticipant,
  useVideoTrack,
  useDevices,
  useDaily,
  useDailyEvent,
} from "@daily-co/daily-react-hooks";
import UserMediaError from "../usermediaerror/UserMediaError";
import PropTypes from "prop-types";
import "./hairCheck.css";
import { Button } from "react-bootstrap";
export default function HairCheck({ joinCall, cancelCall }) {
  const localParticipant = useLocalParticipant();
  const videoTrack = useVideoTrack(localParticipant?.session_id);
  const {
    microphones,
    speakers,
    cameras,
    setMicrophone,
    setCamera,
    setSpeaker,
  } = useDevices();
  const callObject = useDaily();
  const videoElement = useRef();

  const [getUserMediaError, setGetUserMediaError] = useState(false);

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, [])
  );

  const onChange = (e) => {
    callObject.setUserName(e.target.value);
  };

  const join = (e) => {
    e.preventDefault();
    joinCall();
  };

  useEffect(() => {
    if (!videoTrack.persistentTrack) return;
    if (videoElement?.current) {
      videoElement.current.srcObject =
        videoTrack.persistentTrack &&
        new MediaStream([videoTrack?.persistentTrack]);
    }
  }, [videoTrack.persistentTrack]);

  const updateMicrophone = (e) => {
    setMicrophone(e.target.value);
  };

  const updateSpeakers = (e) => {
    setSpeaker(e.target.value);
  };

  const updateCamera = (e) => {
    setCamera(e.target.value);
  };

  return getUserMediaError ? (
    <UserMediaError />
  ) : (
    <form className="hair-check " onSubmit={join}>
      <h1 className="hair-check-header text-white">Setup your hardware</h1>
      {/* Video preview */}
      {videoTrack?.persistentTrack && (
        <video
          className="align-self-md-center"
          autoPlay
          muted
          playsInline
          ref={videoElement}
        />
      )}

      {/* Username */}
      <div>
        <label htmlFor="username" className="text-white">
          Your name:
        </label>
        <input
          name="username"
          type="text"
          placeholder="Enter username"
          onChange={(e) => onChange(e)}
          value={localParticipant?.user_name || "NewParticipant "}
        />
      </div>

      {/* Microphone select */}
      <div>
        <label htmlFor="micOptions" className="text-white">
          Microphone:
        </label>
        <select name="micOptions" id="micSelect" onChange={updateMicrophone}>
          {microphones?.map((mic) => (
            <option
              key={`mic-${mic.device.deviceId}`}
              value={mic.device.deviceId}
            >
              {mic.device.label}
            </option>
          ))}
        </select>
      </div>

      {/* Speakers select */}
      <div>
        <label htmlFor="speakersOptions" className="text-white">
          Speakers:
        </label>
        <select
          name="speakersOptions"
          id="speakersSelect"
          onChange={updateSpeakers}
        >
          {speakers?.map((speaker) => (
            <option
              key={`speaker-${speaker.device.deviceId}`}
              value={speaker.device.deviceId}
            >
              {speaker.device.label}
            </option>
          ))}
        </select>
      </div>

      {/* Camera select */}
      <div>
        <label htmlFor="cameraOptions" className="text-white">
          Camera:
        </label>
        <select name="cameraOptions" id="cameraSelect" onChange={updateCamera}>
          {cameras?.map((camera) => (
            <option
              key={`cam-${camera.device.deviceId}`}
              value={camera.device.deviceId}
            >
              {camera.device.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={join}
        type="submit"
        className="hair-button btn-success mb-3"
      >
        Join call
      </Button>
      <Button
        onClick={cancelCall}
        className="hair-button btn-secondary "
        type="button"
      >
        Back to start
      </Button>
    </form>
  );
}
HairCheck.propTypes = {
  joinCall: PropTypes.func.isRequired,
  cancelCall: PropTypes.func.isRequired,
};
