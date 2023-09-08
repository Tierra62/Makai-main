import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import debug from "sabio-debug";
import "./stands.css";
import MapStand from "./MapStand";
const _logger = debug.extend("StandDirections");

function StandDirections() {
  const { state } = useLocation();
  const [standData, setStandData] = useState(state);
  _logger("state in directions", setStandData);

  return (
    <>
      <Container className="justify-content-md-center text-center">
        <Row>
          <h1 className="text-white m-3">
            {`Let's visit "`}
            {standData.standType.name}
            {`"`}
          </h1>

          <p className="text-white">
            <b className="stand-warn-directions ">
              Please allow to share your location from the browser.{" "}
            </b>
            Or, you can enter your current location here:{" "}
          </p>
        </Row>
        <Row>
          <MapStand stand={standData} />
        </Row>
      </Container>
    </>
  );
}

export default StandDirections;
