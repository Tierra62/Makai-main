import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import "./SiteTraining.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileEdit } from "@fortawesome/free-solid-svg-icons";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Beach from "../../assets/img/illustrations/beach.jpg";

function SiteTrainingCard(props) {
  const aTraining = props.training;
  const onEditClicked = () => {
    swal({
      title: "Are you sure you want to edit the details of this Training?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "btn-danger btn",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "btn-success btn",
          closeModal: true,
        },
      },
    }).then((willEdit) => {
      if (willEdit) {
        navigateToEditPage();
      }
    });
  };

  const onDeleteClicked = () => {
    swal({
      title: "Are you sure you want to Delete the Training?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "btn-danger btn",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "btn-success btn",
          closeModal: true,
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        deleteTraining();
      }
    });
  };

  const deleteTraining = () => {
    props.onTrainingClicked(props.training);
  };

  const navigate = useNavigate();
  const navigateToEditPage = () => {
    const trainingState = {
      state: { type: "Training_Edit", payload: aTraining },
    };
    navigate(`/training/form/${aTraining.id}`, trainingState);
  };

  const [imgSrc, setImgSrc] = useState(aTraining.coverImageUrl);

  const handleError = () => setImgSrc(Beach);

  function navigateToLessons() {
    const stateForTransport = { type: "LESSONS_PAGE", payload: aTraining };
    navigate("/training/" + aTraining.id + "/lessons", stateForTransport);
  }

  const [showMore, setShowMore] = useState(false);

  return (
    <div className="training-row-card">
      <div className="training-card-body">
        <div className="training-section">
          <div className="training-container-card">
            <div className="card training-card-main">
              {!showMore ? (
                <div className="training-content-card">
                  <div className="training-card-image">
                    <img
                      src={imgSrc}
                      onError={handleError}
                      alt="Image of Makai"
                      onClick={navigateToLessons}
                    />
                  </div>
                  <div className="training-card-content">
                    <h3>
                      {aTraining.title}
                      <br />
                      <span>{aTraining.category.name} </span>
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="training-card-description">
                  {aTraining.description}
                </div>
              )}
              {props.currentUser.roles.includes("Admin") && !showMore ? (
                <ul className="sci">
                  <li className="training-buttons-card">
                    <button
                      className="btn btn-danger training-button-delete"
                      onClick={onDeleteClicked}
                    >
                      Delete{" "}
                      <FontAwesomeIcon
                        icon={faRemove}
                        className=" iconlist training-iconlist hover-700"
                      />
                    </button>{" "}
                    <button
                      className="btn btn-info training-button-edit"
                      onClick={onEditClicked}
                    >
                      Edit{" "}
                      <FontAwesomeIcon
                        icon={faFileEdit}
                        className="iconlist training-iconlist hover-700"
                      />
                    </button>
                  </li>
                </ul>
              ) : (
                ""
              )}

              <button
                className="training-icongrid btn btn-primary"
                onClick={() => setShowMore(!showMore)}
              >
                Description
                <FontAwesomeIcon
                  icon={faArrowUp}
                  className=" iconlist training-iconlist hover-700"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SiteTrainingCard.propTypes = {
  training: PropTypes.shape({
    id: PropTypes.int,
    coverImageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    isDeleted: PropTypes.bool.isRequired,
  }),
  onTrainingClicked: PropTypes.func,
};
SiteTrainingCard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.int,
    roles: PropTypes.string,
  }),
};
export default SiteTrainingCard;
