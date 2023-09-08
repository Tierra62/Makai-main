import React from "react";
import debug from "sabio-debug";
import { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import ratingsService from "services/ratingsService";
import PropTypes from "prop-types";
import toastr from "toastr";
import "./ratings.css";

const _logger = debug.extend("Rating");

const { entityTypes } = ratingsService;

const sizeChart = {
  small: {
    starSize: 16,
    font: "rating-text-small",
  },
  medium: {
    starSize: 22,
    font: "rating-text-medium",
  },
  large: {
    starSize: 28,
    font: "rating-text-large",
  },
};

const demoEntity = {
  id: 150,
  typeId: 1,
  commentId: 420,
};

function getEntityTypeId(type) {
  let result = null;
  if (typeof type === "number") {
    result = type;
  } else {
    result = entityTypes[type];
  }
  return result;
}

function Ratings({ entity, size }) {
  const [avgState, setAvgState] = useState({
    averageRating: 0,
    totalNumber: 0,
  });

  const [rating, setRating] = useState({
    entityId: entity?.entityId || demoEntity.id,
    entityTypeId: getEntityTypeId(entity?.entityTypeId) || demoEntity.typeId,
    commentId: entity?.commentId || demoEntity.commentId,
    rating: entity?.rating,
  });

  const [sizeClass, setSizeClass] = useState({
    star: sizeChart.small.starSize,
    text: sizeChart.small.font,
  });

  useEffect(() => {
    if (size) {
      setSizeClass((prevState) => {
        let newState = { ...prevState };
        newState.star = sizeChart[size].starSize;
        newState.text = sizeChart[size].font;
        return newState;
      });
    }
  }, []);

  useEffect(() => {
    if (rating.entityId && rating.entityTypeId) {
      ratingsService
        .getAverage(rating.entityId, rating.entityTypeId)
        .then(onGetAverageSuccess)
        .catch(onGetAverageError);
    }
  }, [rating.rating]);

  const handleSubmit = (value) => {
    setRating((prevRating) => {
      let newState = { ...prevRating };
      newState.rating = value;
      return newState;
    });

    const payload = {
      ...rating,
      rating: value,
    };

    ratingsService
      .addRating(payload)
      .then(onHandleSubmitSuccess)
      .catch(onHandleSubmitError);
  };

  const onHandleSubmitSuccess = (data) => {
    _logger("Rating success", data);
    toastr.success("Rating Submitted");
  };

  const onHandleSubmitError = (error) => {
    _logger("Add rating error", error);
    toastr.error("Rating submit error");
  };

  const onGetAverageSuccess = (response) => {
    setAvgState((prevAverage) => {
      let newerState = { ...prevAverage };
      newerState.averageRating = response.item.averageRating;
      newerState.totalNumber = response.item.totalNumber;
      return newerState;
    });
  };

  const onGetAverageError = (error) => {
    _logger("Get average error", error);
    toastr.error("Get average error");
  };

  return (
    <div className="flex">
      <Rating
        onClick={handleSubmit}
        className={"my-4"}
        initialValue={avgState.averageRating}
        size={sizeClass.star}
        transition={true}
        fillColor={"#f5803e"}
      />
      <span className={`ms-1 fw-bolder ${sizeClass.text}`}>
        {avgState.averageRating}({avgState.totalNumber})
      </span>
    </div>
  );
}

Ratings.propTypes = {
  size: PropTypes.number,
  entity: PropTypes.shape({
    entityId: PropTypes.number.isRequired,
    entityTypeId: PropTypes.number.isRequired,
    commentId: PropTypes.number,
    rating: PropTypes.number,
  }),
};

export default Ratings;
