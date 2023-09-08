import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import SoftBadge from "components/common/SoftBadge";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("LocationFinderCard");

function LocationFinderCard(props) {
  false && _logger("test");
  const stand = props.standData;
  const navigate = useNavigate();

  const lineTwoNullCheck = (stand) => {
    if (stand.location.lineTwo) {
      return `${stand.location.lineOne}, ${stand.location.lineTwo}`;
    } else {
      return `${stand.location.lineOne}`;
    }
  };

  const softBadgeClassNames = (data) => {
    if (data === "Available") {
      return "success";
    } else {
      return "warning";
    }
  };

  const goToProducts = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const goToDirections = () => {
    navigate("/stands/directions", { state: props.standData });
  };

  return (
    <>
      <Card bg="light" className="mb-1" onClick={goToProducts}>
        <Card.Body>
          <Row>
            <Col xs={6}>
              <p className="mb-0">{`${lineTwoNullCheck(stand)} ${
                stand.location.city
              }, ${stand.location.state.col3} ${stand.location.zip}`}</p>
            </Col>
            <Col xs={3}>
              <SoftBadge
                pill
                bg={softBadgeClassNames(stand.standStatus.name)}
                className="d-md-block d-s-flex"
              >
                {stand.standStatus.name}
              </SoftBadge>
            </Col>
            <Col xs={3} className="text-center">
              <Button size="sm" variant="primary" onClick={goToDirections}>
                Get Directions
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

LocationFinderCard.propTypes = {
  standData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    standStatus: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    standType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    partner: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
      businessPhone: PropTypes.string,
      siteUrl: PropTypes.string,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string,
        avatrUrl: PropTypes.string,
      }),
      dateCreated: PropTypes.string.isRequired,
      dateModified: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
    }),
    isPrivate: PropTypes.bool.isRequired,
    isReservable: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      id: PropTypes.number.isRequired,
      lineOne: PropTypes.string.isRequired,
      lineTwo: PropTypes.string,
      city: PropTypes.string.isRequired,
      zip: PropTypes.string,
      state: PropTypes.shape({
        name: PropTypes.string.isRequired,
        col3: PropTypes.string.isRequired,
      }),
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      isDeleted: PropTypes.bool.isRequired,
    }),
    dateOpened: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      avatrUrl: PropTypes.string,
    }),
    modifiedBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mi: PropTypes.string,
      avatrUrl: PropTypes.string,
    }),
  }),
};

export default React.memo(LocationFinderCard);
