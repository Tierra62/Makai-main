import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Beach from "../../assets/img/illustrations/beach.jpg";
import "./SiteTraining.css";

function TrainingCard(props) {
  const aTraining = props.training;
  const [imgSrc, setImgSrc] = useState(aTraining.coverImageUrl);

  const handleError = () => setImgSrc(Beach);

  const navigate = useNavigate();
  const navigateToList = () => {
    navigate("/training/list");
  };

  return (
    <Row className="training-row-form">
      <Col>
        <div className="training-card-body">
          <Button
            className="btn btn-info  training-icongrid"
            onClick={navigateToList}
          >
            Go back to list
          </Button>

          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Go back to list</Tooltip>}
          >
            <img
              className=" single-training-card-image"
              src={imgSrc}
              onError={handleError}
              alt="Image of Makai"
              onClick={navigateToList}
            ></img>
          </OverlayTrigger>

          <div className="training-card-body">
            <h3 className="training-card-title-preview"> {aTraining.title}</h3>
            <h5 className="training-card-text-preview">
              {aTraining.category.name}
            </h5>
            <p className="training-card-text">{aTraining.description}</p>
          </div>
        </div>
      </Col>
      <Col>
        <div className="training-card-body">
          <h1>Creater of Training</h1>
          <img
            className=" img-fluid rounded-circle"
            src={aTraining.createdBy.avatarUrl}
            onError={handleError}
            alt="Image of Makai"
            onClick={navigateToList}
          ></img>

          <div className="training-card-body">
            <h3 className="training-card-title-preview">
              {" "}
              {aTraining.createdBy.firstName} {aTraining.createdBy.mi}{" "}
              {aTraining.createdBy.lastName}
            </h3>
          </div>
        </div>
      </Col>
    </Row>
  );
}
TrainingCard.propTypes = {
  training: PropTypes.shape({
    coverImageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    createdBy: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }),
  }),
};
export default TrainingCard;
