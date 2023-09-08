import React from "react";
import CoverDonate from "./CoverDonate";
import { Container } from "react-bootstrap";
import CharitableFunds from "./CharitableFunds";
import "./donations.css";

function Donations() {
  return (
    <>
      <CoverDonate />
      <Container className="mt-7 text-center">
        <h5 className="donate-subtitle-section">Donation</h5>
        <h1 className="mt-3 donate-title-section">Give Your Help</h1>
        <CharitableFunds />
      </Container>
    </>
  );
}

export default Donations;
