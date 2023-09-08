import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import Makai from "../../assets/img/logos/Makai.png";
import Member from "../../assets/img/icons/Member.png";
import Partner from "../../assets/img/icons/Partner.png";
import "./partnercard.css";

const _logger = debug.extend("partners");

const LocalPartner = () => {
  _logger("partners");

  const navigate = useNavigate();

  const handleClickPartnerMember = (member) => {
    _logger("Redirecting to:/new");

    const information = { type: "PARTNERMEMBER_VIEW", payload: member };
    navigate(`/partner/new`, { state: information });
  };

  const handleClickPartner = (partner) => {
    _logger("Redirecting to:/new");

    const information = { type: "PARTNER_VIEW", payload: partner };
    navigate(`/partner/new`, { state: information });
  };

  return (
    <Container className="p-4">
      <Row className="justify-content-center p-4">
        <Col sm={12} md={6} lg={4} className="mb-4">
          <Card className="bg-light text-dark partner-card">
            <Card.Img
              variant="top"
              src={Makai}
              className="makai-logo"
              alt="Makai icon"
            />
            <Card.Body className="text-center">
              <Card.Title as="h5" className="text-center">
                Register as Partner
              </Card.Title>
              <Card.Img
                variant="top"
                src={Partner}
                className="card-icon"
                alt="Makai icon"
              />
              <Card.Text>
                <br />
                Are you interested in partnering with{" "}
                <strong>Makai Rentals</strong> by adding a stand to your
                location? Register here for your next great opportunity to
                expand your waterfront business!
              </Card.Text>

              <Link to="/partner/new">
                <Button onClick={handleClickPartner}>Register</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6} lg={4} className="mb-4">
          <Card className="bg-light text-dark partner-card">
            <Card.Img
              variant="top"
              src={Makai}
              className="makai-logo"
              alt="Makai icon"
            />
            <Card.Body className="text-center">
              <Card.Title as="h5">Register as Partner Member</Card.Title>
              <Card.Img
                variant="top"
                src={Member}
                className="card-icon"
                alt="Member icon"
              />
              <Card.Text>
                <br />
                Are you registering as a member of a stand at{" "}
                <strong>Makai Rentals</strong>?
                <br />
                Register Here!
              </Card.Text>
              <br />
              <Link to="/partner/new">
                <Button onClick={handleClickPartnerMember}>Register</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LocalPartner;
