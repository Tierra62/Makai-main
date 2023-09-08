import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import ChatStatsReport from "./ChatStatsReport";
import "../chatstatistics/chatstats.css";

function ChatStatsDashboard(props) {
  const currUser = props.currentUser;
  const [statsChosen, setStatsChosen] = useState("user");

  /*No using Formik because radio are being used as placeholders
  , not onSubmit or onChange behavior needed
  , only using radio tags for UI purposes*/
  const onClickHandler = (e) => {
    setStatsChosen(e.target.value);
  };

  return (
    <>
      <Card className="chatstats-background pt-3">
        <Card.Title className="text-center">
          <h1 className="chatstats-title">Video Meetings Statistics</h1>
        </Card.Title>
        <Card.Body>
          <Row className="mb-3  radio-button text-center">
            <Col className="p-0">
              <input
                value="user"
                name="radios"
                className="text-center"
                type="radio"
                id="user-stats"
                defaultChecked={statsChosen}
                onClick={onClickHandler}
              />
              <label htmlFor="user-stats">My Chat Statistics</label>
            </Col>
            <Col className="p-0">
              <input
                value="all"
                name="radios"
                className="text-center"
                type="radio"
                id="all-stats"
                onClick={onClickHandler}
              />
              <label htmlFor="all-stats">All Chat Statistics</label>
            </Col>
          </Row>
          <ChatStatsReport currentUser={currUser} chosenStats={statsChosen} />
        </Card.Body>
      </Card>
    </>
  );
}

ChatStatsDashboard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default ChatStatsDashboard;
