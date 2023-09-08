import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./donations.css";

function CharityCard(props) {
  const { name, description, url } = props.charity;
  return (
    <>
      <Card className="donate-single-charity-card">
        <Card.Title className="donate-card-title">{name}</Card.Title>
        <Card.Body>
          <Card.Text>{description} </Card.Text>
          <Card.Link>{url}</Card.Link>
        </Card.Body>
      </Card>
    </>
  );
}

CharityCard.propTypes = {
  charity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default CharityCard;
