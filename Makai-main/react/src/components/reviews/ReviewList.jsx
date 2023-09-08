import React, { useState, useEffect } from "react";
import toastr from "toastr";
import debug from "sabio-debug";
import reviewService from "services/reviewService";
import ReviewCard from "./ReviewCard";
import PropTypes from "prop-types";
import userService from "services/userService";
import ReviewPagination from "./ReviewPagination";
import "./pagination.css";

const ReviewList = ({
  entityId,
  handleEdit,
  handleReview,
  isRefresh,
  handleDelete,
}) => {
  const _logger = debug.extend("ReviewList.jsx");
  _logger("Loaded Review List", entityId);

  const [reviews, setReviews] = useState({
    arrayOfReviews: [],
    arrayOfComponents: [],
    arrayCurrentPage: [],
  });

  const [load, setLoad] = useState(false);

  const [currentUser, setUser] = useState({
    id: 0,
    name: "",
    roles: [],
    tenantId: "",
  });

  useEffect(() => {
    userService.getCurrent().then(onGetCurrentSuccess).catch(onGetCurrentError);
  }, [entityId, isRefresh]);

  useEffect(() => {
    getAllReviews();
  }, [currentUser]);

  const onGetCurrentSuccess = (data) => {
    setUser(() => {
      const pd = { ...data.item };
      _logger("Got User", data.item);
      return pd;
    });
  };

  const getAllReviews = () => {
    _logger("Getting reviews", entityId);
    if (entityId !== 0) {
      reviewService
        .getByEntityId(entityId)
        .then(onGetAllSuccess)
        .catch(onGetAllError);
    }
  };

  const onGetCurrentError = (error) => {
    _logger("Error", error);
    toastr["error"]("There was a problem loading reviews", "error");
  };

  const onGetAllSuccess = (data) => {
    _logger("Success: ", data);
    let reviewsArray = data.item;
    setReviews((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfReviews = reviewsArray
        .filter((review) => !review.isDeleted)
        .reverse();
      pd.arrayOfComponents = pd.arrayOfReviews?.map(mapReviews);
      pd.arrayCurrentPage = [];
      for (let i = 0; i < pageSize; i++) {
        if (pd.arrayOfReviews[i]) {
          pd.arrayCurrentPage.push(pd.arrayOfComponents[i]);
        }
      }
      return pd;
    });
    setLoad(true);
  };

  useEffect(() => {
    for (let i = 0; i < reviews.arrayOfReviews.length; i++) {
      _logger(reviews.arrayOfReviews[i], currentUser);
      if (
        reviews.arrayOfReviews[i].user.id === currentUser.id &&
        reviews.arrayOfReviews[i].isDeleted === false
      ) {
        handleReview();
      }
    }
  }, [load]);

  const onGetAllError = (error) => {
    _logger("Error:", error);
    setLoad(false);
  };

  const mapReviews = (review) => {
    if (review.isDeleted === false) {
      return (
        <ReviewCard
          review={review}
          key={review.id}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentUser={currentUser}
        />
      );
    } else {
      return <></>;
    }
  };

  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(5);

  const onPageChange = (page) => {
    setCurrent(page);
    setReviews((prevState) => {
      const pd = { ...prevState };
      pd.arrayCurrentPage = [];
      for (
        let i = (page - 1) * pageSize;
        i < (page - 1) * pageSize + pageSize;
        i++
      ) {
        if (pd.arrayOfComponents[i]) {
          pd.arrayCurrentPage.push(pd.arrayOfComponents[i]);
        }
      }
      return pd;
    });
  };

  return (
    <>
      <hr></hr>
      <h3 className="text-light justify-content-center d-flex">Reviews</h3>
      <div className="row gap-3 justify-content-center">
        {load ? reviews.arrayCurrentPage : "No Reviews Yet."}
        <div className="d-flex justify-content-center">
          <ReviewPagination
            onChange={onPageChange}
            current={current}
            total={reviews.arrayOfReviews.length}
          ></ReviewPagination>
        </div>
      </div>
    </>
  );
};

ReviewList.propTypes = {
  entityId: PropTypes.number.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleReview: PropTypes.func.isRequired,
  isRefresh: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ReviewList;
