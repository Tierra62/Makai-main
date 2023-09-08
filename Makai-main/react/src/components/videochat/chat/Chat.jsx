import { useCallback, useState } from "react";
import debug from "sabio-debug";
import {
  useAppMessage,
  useLocalParticipant,
} from "@daily-co/daily-react-hooks";
import React from "react";
import { Arrow } from "../tray/icons/Index";
import "./chat.css";
import PropTypes from "prop-types";
const _logger = debug.extend("Chat");
export default function Chat({ isChatVisible, toggleChat }) {
  const localParticipant = useLocalParticipant();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback(
      (ev) =>
        setMessages((existingMessages) => [
          ...existingMessages,
          {
            msg: ev.data.msg,
            name: ev.data.name,
          },
        ]),
      []
    ),
  });

  const sendMessage = useCallback(
    (message) => {
      /* Send the message to all participants in the chat - this does not include ourselves!
       * See https://docs.daily.co/reference/daily-js/events/participant-events#app-message
       */
      sendAppMessage(
        {
          msg: message,
          name: localParticipant?.user_name || "Guest",
        },
        "*"
      );
      _logger("participant", localParticipant);
      /* Since we don't receive our own messages, we will set our message in the messages array.
       * This way _we_ can also see what we wrote.
       */
      setMessages([
        ...messages,
        {
          msg: message,
          name: localParticipant?.user_name || "Guest",
        },
      ]);
    },
    [localParticipant, messages, sendAppMessage]
  );
  const onChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) return; // don't allow people to submit empty strings
    sendMessage(inputValue);
    setInputValue("");
  };
  return isChatVisible ? (
    <div
      className="card-chat chat bg-light-blue position-fixed"
      style={{ right: 0 }}
    >
      <div className="card-header" id="chatheader">
        <button
          onClick={toggleChat}
          className="close-chat btn btn-secondary"
          type="button"
        >
          Close chat
        </button>
      </div>
      <ul className="card-body chat-messages" id="chatmessages">
        {messages?.map((message, index) => (
          <li key={`message-${index}`} className="chat-message">
            <span className="chat-message-author">{message?.name}</span>:{" "}
            <p className="chat-message-body">{message?.msg}</p>
          </li>
        ))}
      </ul>
      <div className="card-footer add-message" id="chatfooter">
        <form className="chat-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              className="form-control chat-input"
              type="text"
              placeholder="Type your message here.."
              value={inputValue}
              onChange={(e) => onChange(e)}
            />
            <button
              type="submit"
              className="btn btn-primary chat-submit-button"
            >
              <Arrow />
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}

Chat.propTypes = {
  isChatVisible: PropTypes.bool.isRequired,
  toggleChat: PropTypes.func.isRequired,
};
