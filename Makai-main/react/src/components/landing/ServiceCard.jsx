import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import "./Landing.css";

const ServiceCard = ({ title, description, children }) => (
  <Card className="card-span h-100 text-black landing-bg-ocean">
    <Card.Body className="pt-6 pb-4">
      <h5 className="mb-2 text-white">{title}</h5>
      {description && <p className="text-white">{description}</p>}
      {children}
    </Card.Body>
  </Card>
);

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default ServiceCard;
