import React, { useEffect, useState, useCallback } from "react";
import videoChatService from "services/videoChatService";
import DailyIframe from "@daily-co/daily-js";
import { DailyProvider } from "@daily-co/daily-react-hooks";
import PropTypes from "prop-types";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "./Utils";
import debug from "sabio-debug";
import HomeScreen from "../homescreen/HomeScreen";
import Call from "../call/Call";
import Header from "../header/Header";
import Tray from "../tray/Tray";
import HairCheck from "../haircheck/HairCheck";
import toastr from "toastr";
import RoomList from "../roomlist/RoomList";
import "../videochatapp/videoApp.css";
const _logger = debug.extend("Video");
const STATE_IDLE = "STATE_IDLE";
const STATE_CREATING = "STATE_CREATING";
const STATE_JOINING = "STATE_JOINING";
const STATE_JOINED = "STATE_JOINED";
const STATE_LEAVING = "STATE_LEAVING";
const STATE_ERROR = "STATE_ERROR";
const STATE_HAIRCHECK = "STATE_HAIRCHECK";

export default function VideoApp(props) {
  const currUser = props.currentUser;
  _logger("currUser", currUser);
  const [roomListData, setRoomListData] = useState({
    roomListArray: [],
    roomListComponent: [],
    timeHandler: null,
    joining: false,
    leaving: false,
    host: {
      HostId: null,
      DailyId: null,
      RoomName: null,
      Duration: null,
      StartTime: null,
    },
    participant: {
      DailyMeetingId: null,
      UserId: null,
      Duration: null,
      TimeJoined: null,
    },
  });

  const [state, setState] = useState({
    appState: STATE_IDLE,
    roomUrl: null,
    callObject: null,
    apiError: false,
    roomData: {
      roomUrl: null,
      roomName: null,
      roomToken: null,
      hostId: null,
      localUrl: null,
    },
  });

  const { appState, roomUrl, callObject, roomData } = state;

  const startVideoChat = () => {
    videoChatService
      .getActiveRoomList(10)
      .then(getActiveSuccess)
      .catch(getActiveError);
  };

  const getActiveSuccess = (response) => {
    _logger("All rooms call when new one created: ", response);
    const activeRmList = response.item.data;
    const totalCount = response.item.total_count;

    if (totalCount > 0) {
      const filteredRooms = activeRmList.filter((room) => {
        let isRoomCreated = false;
        if (room.name === state.roomData.roomName) {
          isRoomCreated = true;
        }
        return isRoomCreated;
      });
      _logger("# of ACTIVE Rooms with same name: ", filteredRooms.length);

      if (filteredRooms.length === 0) {
        createRoom();
      } else {
        startJoiningCall();
      }
    } else {
      createRoom();
    }
  };

  const getActiveError = (err) => {
    _logger("get active room ERROR", err);
    toastr.error("Getting Active Room List ");
  };

  const createRoom = () => {
    const randomString = Math.random().toString(36).substring(7);
    const roomName = `Admin-MEETING-${randomString}`;
    getRoomToken();
    setState({
      ...state,
      appState: STATE_CREATING,
    });
    let payload = {
      name: roomName,
      privacy: 1,
      properties: {
        startAudioOff: false,
        startVideoOff: false,
        enableChat: true,
        exp: 2700,
      },
    };
    videoChatService
      .getNewVideoChat(payload)
      .then(onCreateNewRoomSuccess)
      .catch(onCreateNewRoomError);
  };

  const getRoomToken = () => {
    const tokenRequest = {
      properties: {
        roomName: roomData.roomName,
        userName: currUser.name,
        userId: currUser.id,
        enableScreenShare: true,
        startVideoOff: true,
        startAudioOff: true,
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    };
    videoChatService
      .getRoomToken(tokenRequest)
      .then(getTokenSuccess)
      .catch(getTokenError);
  };

  const getTokenSuccess = (response) => {
    const token = response.item.token;
    setState((prevState) => ({
      ...prevState,
      roomData: {
        ...prevState.roomData,
        roomToken: token,
      },
    }));
    _logger("newToken generated: ", token);
  };

  const getTokenError = () => {
    toastr.error("Creating TOKEN ERROR ");
  };

  const onCreateNewRoomError = (err) => {
    _logger("createVideoChat error", err);
    setState({
      ...state,
      apiError: false,
    });
  };

  const onCreateNewRoomSuccess = (data) => {
    setState({
      appState: STATE_HAIRCHECK,
      callObject: null,
      roomUrl: data.item.url,
      roomData: data.item.url,
    });
    setRoomListData((prevState) => {
      const newState = { ...prevState };
      newState.timeHandler = Date.now();
      newState.host.HostId = currUser.id;
      newState.host.DailyId = data.item.id;
      newState.host.RoomName = data.item.name;
      newState.host.StartTime = new Date();
      return newState;
    });
    startHairCheck(data.item.url);
    toastr.success("Video Chat Room Created.");
  };

  useEffect(() => {
    roomListClick();
  }, []);

  const roomListClick = () => {
    videoChatService
      .getActiveRoomList(10)
      .then(onGetRoomsClickSucess)
      .catch((err) => {
        _logger("Error getting room list", err);
      });
  };

  const saveMeetingInfo = () => {
    if (roomListData.host.HostId) {
      setRoomListData((prevState) => {
        const newState = { ...prevState };
        newState.host.Duration = Math.floor(
          (Date.now() - roomListData.timeHandler) / 1000
        );
        return newState;
      });
    }
    if (roomListData.participant.UserId) {
      setRoomListData((prevState) => {
        const newState = { ...prevState };
        newState.participant.Duration = Math.floor(
          (Date.now() - roomListData.timeHandler) / 1000
        );
        return newState;
      });
    }
  };

  useEffect(() => {
    if (roomListData.host.HostId) {
      videoChatService
        .createStatistics(roomListData.host)
        .then(onStatisticsSuccess)
        .catch(onSavingMeetingInfoError);
    }
    if (roomListData.participant.UserId) {
      videoChatService
        .insertParticipants(roomListData.participant)
        .then(onParticipantSuccess)
        .catch(onSavingMeetingInfoError);
    }
  }, [roomListData.host.Duration, roomListData.participant.Duration]);

  const onStatisticsSuccess = () => {
    _logger("Meeting info saved");
    setRoomListData((prevState) => {
      prevState.host.DailyId = null;
      prevState.host.Duration = null;
      prevState.host.HostId = null;
      prevState.host.RoomName = null;
      prevState.host.StartTime = null;
      prevState.joining = false;
      return prevState;
    });
  };

  const onParticipantSuccess = () => {
    _logger("Meeting info saved");
    setRoomListData((prevState) => {
      prevState.participant.DailyMeetingId = null;
      prevState.participant.Duration = null;
      prevState.participant.TimeJoined = null;
      prevState.participant.UserId = null;
      prevState.joining = false;
      return prevState;
    });
  };

  const onSavingMeetingInfoError = (error) => {
    _logger("Couldn't save the meet info: ", error);
  };

  const onGetRoomsClickSucess = (response) => {
    let arrOfRoms = response.item.data;
    setRoomListData((prevState) => {
      const listData = { ...prevState };
      listData.roomListArray = arrOfRoms;
      listData.roomListComponent = arrOfRoms.map(mapRooms);
      return listData;
    });
  };
  const onClickJoin = (roomId) => {
    setRoomListData((prevState) => {
      const newState = { ...prevState };
      newState.joining = true;
      newState.participant.UserId = currUser.id;
      newState.timeHandler = Date.now();
      newState.participant.DailyMeetingId = roomId;
      newState.participant.TimeJoined = new Date();
      return newState;
    });
  };

  const mapRooms = (room, index) => {
    _logger(index, room);
    return (
      <RoomList
        key={index}
        room={room}
        roomCreated={room.created_At}
        currUser={currUser}
        joiningHandler={onClickJoin}
      />
    );
  };

  const startHairCheck = useCallback(async (url) => {
    const newCallObject = DailyIframe.createCallObject();
    setState((prevState) => ({
      ...prevState,
      roomUrl: url,
      callObject: newCallObject,
      appState: STATE_HAIRCHECK,
    }));
    await newCallObject.preAuth({ url });
    await newCallObject.startCamera();
  }, []);

  const joinCall = useCallback(() => {
    callObject.join({ url: roomUrl });
  }, [callObject, roomUrl]);

  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    if (appState === STATE_ERROR) {
      callObject.destroy().then(() => {
        setState((prevState) => ({
          ...prevState,
          roomUrl: null,
          callObject: null,
          appState: STATE_IDLE,
        }));
      });
    } else {
      saveMeetingInfo();
      setState((prevState) => ({
        ...prevState,
        appState: STATE_LEAVING,
      }));
      callObject.leave();
    }
  }, [callObject, appState]);

  useEffect(() => {
    const url = roomUrlFromPageUrl();
    if (url) {
      startHairCheck(url);
    }
  }, [startHairCheck, roomListData.joining]);

  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(state.roomUrl);
    if (pageUrl === window.location.toString()) return;
    window.history.replaceState(null, null, pageUrl);
    if (!roomListData.host.HostId) {
    }
  }, [state.roomUrl]);

  useEffect(() => {
    if (!state.callObject) return;

    const events = ["joined-meeting", "left-meeting", "error", "camera-error"];

    function handleNewMeetingState() {
      switch (state.callObject.meetingState()) {
        case "joined-meeting":
          setState((prevState) => ({
            ...prevState,
            appState: STATE_JOINED,
          }));

          state.callObject
            .setUserName("Admin", { thisMeetingOnly: true })
            .then((name) => {
              _logger(`User name set to: ${name}`);
            })
            .catch((error) => {
              _logger("Error setting user name:", error);
            });

          break;
        case "left-meeting":
          state.callObject.destroy().then(() => {
            setState((prevState) => ({
              ...prevState,
              roomUrl: null,
              callObject: null,
              appState: STATE_IDLE,
            }));
          });
          break;
        case "error":
          setState((prevState) => ({
            ...prevState,
            appState: STATE_ERROR,
          }));
          break;
        default:
          break;
      }
    }
    handleNewMeetingState();
    events.forEach((event) => callObject.on(event, handleNewMeetingState));

    return () => {
      events.forEach((event) => callObject.off(event, handleNewMeetingState));
    };
  }, [callObject]);

  const showCall =
    !state.apiError &&
    [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(state.appState);

  const showHairCheck = !state.apiError && state.appState === STATE_HAIRCHECK;

  const renderApp = () => {
    if (state.apiError) {
      return (
        <div className="api-error">
          <h1>Error</h1>
          <p>
            Room could not be created. Please check your local configuration in
            api.js. For more information, check out the{" "}
            <a href="https://github.com/daily-demos/call-object-react-daily-hooks/blob/main/README.md">
              readme
            </a>
            :)
          </p>
        </div>
      );
    }
    if (showHairCheck) {
      return (
        <DailyProvider callObject={state.callObject}>
          <HairCheck joinCall={joinCall} cancelCall={startLeavingCall} />
        </DailyProvider>
      );
    }
    if (showCall) {
      return (
        <DailyProvider callObject={state.callObject}>
          <Call />
          <Tray leaveCall={startLeavingCall} />
        </DailyProvider>
      );
    }
    return (
      <>
        <div className="homescreen container">
          <div className="card showcase-page-gradient" id="homescreen">
            <HomeScreen
              startVideoChat={startVideoChat}
              roomListClick={roomListClick}
              startHairCheck={startHairCheck}
            />
            <table className="card-body table table-hover w-100">
              <thead>
                <tr className="text-white">
                  <th className="room-list text-sm-center text-white">
                    ROOM NAME
                  </th>
                  <th className="room-list text-sm-center"></th>
                  <th className="room-list text-sm-center text-white">TYPE</th>
                  <th className="room-list text-sm-center"></th>
                  <th className="room-list text-sm-center text-white">
                    OPTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="table form">
                {roomListData?.roomListComponent &&
                  roomListData.roomListComponent}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <React.Fragment>
      <div className="video-app ">
        <Header currUser={props.currentUser} />
        {renderApp()}
      </div>
    </React.Fragment>
  );
}

VideoApp.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
