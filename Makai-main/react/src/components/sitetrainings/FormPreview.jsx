import React from "react";
import PropTypes from "prop-types";
import MakaiLogo from "../../assets/img/logos/Makai.png";
import "./SiteTraining.css";
function TrainingPreview(props) {
  const aTrainng = props.training;

  return (
    <div className="training-container">
      <div className="training-form-preview-card">
        <img
          className="training-preview-card-image d-flex justify-content-center align-items-center "
          src={aTrainng.coverImageUrl ? aTrainng.coverImageUrl : MakaiLogo}
          alt={"No Image to display"}
        ></img>
        <div className="training-card-body-preview">
          <h3 className="training-card-title-preview"> {aTrainng.title}</h3>
          <h5 className="training-card-text-preview">{aTrainng.category}</h5>
          <p className="training-card-text2-preview">{aTrainng.description}</p>
          <div></div>
        </div>
      </div>
    </div>
  );
}
TrainingPreview.propTypes = {
  training: PropTypes.shape({
    coverImageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.required,
  }),
};

export default TrainingPreview;
