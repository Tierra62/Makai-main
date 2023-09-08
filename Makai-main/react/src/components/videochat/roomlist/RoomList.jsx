import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import videoChatService from "services/videoChatService";
import Toastify from "toastify-js";
import debug from "sabio-debug";
import "toastify-js/src/toastify.css";
const _logger = debug.extend("Video");

function RoomList(props) {
  const [isRoomDeleted, setIsRoomDeleted] = useState(false);
  const chatRoom = props.room;
  const dateCreated = props.roomCreated;
  const navigate = useNavigate();

  function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const interval = Math.floor(seconds / 60);
    if (interval < 1) {
      return "created just now";
    }
    if (interval === 1) {
      return "created 1 minute ago";
    }
    return "created " + interval + " minutes ago";
  }

  const dateString = dateCreated;
  const formattedDate = timeSince(dateString);
  _logger("formattedDate", formattedDate);

  if (!chatRoom) {
    return (
      <div className="alert alert-info">
        NO OPEN ROOMS, CLICK,CREATE NEW ROOM
      </div>
    );
  }

  const currentUser = props.currUser;
  const isAdmin = currentUser && currentUser.roles.includes("Admin");
  _logger(props, "currentUser");
  const deleteRoom = (e) => {
    _logger(e.target, chatRoom.name, "delete button");
    videoChatService
      .deleteRoom(chatRoom.name)
      .then(onDeleteRoomSuccess)
      .catch(onDeleteRoomError);
  };
  const onDeleteRoomError = (err) => {
    _logger(err);
    Toastify({
      text: "Error, Room Unable to be deleted!",
      className: "Error",
      style: {
        background: "linear-gradient(to right, red)",
      },
    }).showToast();
  };
  const onDeleteRoomSuccess = (response) => {
    _logger(response);
    Toastify({
      text: "Room Sucessfully Deleted!",
      className: "Success",
      style: {
        background: "linear-gradient(to right, green)",
      },
    }).showToast();
    setIsRoomDeleted(true);
  };

  const handleClick = () => {
    _logger("this is the url", chatRoom.url);
    props.joiningHandler(chatRoom.id);
    navigate(`?roomUrl=${chatRoom.url}`);
  };

  return (
    <>
      {!isRoomDeleted && (
        <tr className="room-list align-self-center w-50 text-white" type="row">
          <td className="text-nowrap text-center">
            {chatRoom && chatRoom.name}
          </td>
          <td className="text-nowrap">({formattedDate && formattedDate})</td>
          <td className="text-nowrap text-sm-center">
            {chatRoom && chatRoom.privacy}
          </td>
          <td>
            {chatRoom && chatRoom.exp && (
              <span className="badge badge rounded-pill d-block p-2 badge-soft-success">
                {chatRoom.exp}
                <span
                  className="ms-1 fas fa-check"
                  data-fa-transform="shrink-2"
                ></span>
              </span>
            )}
          </td>
          <td>
            {chatRoom?.url && (
              <div>
                <Button
                  className="btn btn-success border me-3"
                  onClick={handleClick}
                >
                  Join Room
                </Button>
              </div>
            )}
            {isAdmin && (
              <Button
                type="button"
                onClick={deleteRoom}
                className="btn btn-danger border"
              >
                Delete Room
              </Button>
            )}
          </td>
        </tr>
      )}{" "}
    </>
  );
}

RoomList.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    privacy: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired,
    exp: PropTypes.number,
  }),
  currUser: PropTypes.shape({
    roles: PropTypes.string.isRequired,
  }),
  roomCreated: PropTypes.shape({
    dateCreated: PropTypes.string.isRequired,
  }),
  joiningHandler: PropTypes.func.isRequired,
};

export default RoomList;
