import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Row, Col, Image } from "react-bootstrap";

const Process = ({
  iconText,
  isFirst,
  color,
  title,
  description,
  image,
  inverse,
  children,
}) => {
  return (
    <Row
      className={classNames("flex-center", {
        "mt-7": !isFirst,
        "mt-8": isFirst,
      })}
    >
      <Col
        md={{ order: inverse ? 2 : 0, span: 6 }}
        lg={5}
        xl={4}
        className={classNames({ "pe-lg-6": inverse, "ps-lg-1": !inverse })}
      >
        <Image
          fluid
          className="px-4 px-md-5 mt-lg-1 landing-info-image"
          src={image}
          alt=""
        />
      </Col>
      <Col md lg={5} xl={4} className="mt-4 mt-md-0">
        <h1 className={`text-${color}`}>{iconText}</h1>
        <h3 className="text-secondary">{title}</h3>
        <p className="text-white">{description}</p>
        {children}
      </Col>
    </Row>
  );
};

Process.propTypes = {
  iconText: PropTypes.string.isRequired,
  isFirst: PropTypes.bool,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  inverse: PropTypes.bool,
  children: PropTypes.node,
};

export default Process;
