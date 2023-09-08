import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import "./review.css";
import PropTypes from "prop-types";

const ReviewCard = ({ review, handleEdit, handleDelete, currentUser }) => {
  const _logger = debug.extend("ReviewCard.jsx");
  _logger("Card loaded", review);

  const [showEdit, setEdit] = useState(false);
  //const [current] = useState(currentUser);

  const onEdit = () => {
    handleEdit(review);
  };

  const onDelete = () => {
    handleDelete(review);
  };

  useEffect(() => {
    checkForEdit();
  }, [currentUser.id]);

  const checkForEdit = () => {
    _logger("Success", currentUser);
    if (currentUser.roles.includes("Admin")) {
      setEdit(true);
    } else {
      if (currentUser.id === review.user.id) {
        setEdit(true);
      } else {
        setEdit(false);
      }
    }
  };

  return (
    <div className="card h-100 w-75 makai-background-2">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-10">
            <h4 className="text-light">{review.subject}</h4>
            <span>{review.text}</span>
          </div>
          <div className="col-2 d-flex justify-content-end">
            {showEdit ? (
              <div className="d-flex flex-column gap-3 justify-content-center">
                <button className="btn btn-primary" onClick={onEdit}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={onDelete}>
                  Delete
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.number.isRequired,
    subject: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    entityId: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
    }),
    isDeleted: PropTypes.bool,
  }),
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    tenantId: PropTypes.string.isRequired,
  }),
};

export default ReviewCard;
