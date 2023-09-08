import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import "./review.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { reviewSchema } from "schemas/reviewSchema";
import swal from "sweetalert";
import reviewService from "services/reviewService";
import PropTypes from "prop-types";
import toastr from "toastr";

const Review = ({ entityId, updater, editReview }) => {
  const _logger = debug.extend("Review.jsx");

  const [formData, setFormData] = useState({
    subject: "",
    text: "",
  });

  const [editing, setEditing] = useState(false);

  const handleSubmit = (values) => {
    _logger("Received: ", values, entityId);
    let request = { ...values };
    request.entityId = entityId;
    _logger(request);
    if (editing) {
      request.id = editReview.id;
      reviewService
        .updateReview(editReview.id, request)
        .then(onSubmitSuccess)
        .catch(onSubmitError);
    } else {
      reviewService
        .addReview(request)
        .then(onSubmitSuccess)
        .catch(onSubmitError);
    }
  };

  const onSubmitSuccess = (data) => {
    _logger("Review added", data);
    swal({
      title: "Review Submitted!",
      text: "Thank you for your feedback!",
      icon: "success",
      button: "Close",
    });
    updater();
    setFormData((prevState) => {
      const pd = { ...prevState };
      pd.subject = "";
      pd.text = "";
      return pd;
    });
  };

  const onSubmitError = (error) => {
    _logger("Review failed", error);
    toastr["error"]("There was a problem submitting", "error");
  };

  useEffect(() => {
    if (editReview.id !== 0) {
      _logger("Recieved Review: ", editReview);
      setFormData((previous) => {
        const pd = { ...previous };
        pd.subject = editReview.subject;
        pd.text = editReview.text;
        return pd;
      });
      setEditing(true);
    }
  }, [editReview]);

  return (
    <div className="card d-flex justify-content-center makai-background-1">
      <div className="card-body">
        <div className="row row-cols-2 flex-column">
          <div className="col align-self-center">
            {editing ? (
              <h5 className="card-title text-light">Edit Review</h5>
            ) : (
              <h5 className="card-title text-light">Add A Review</h5>
            )}
          </div>
          <div className="col align-self-center">
            <Formik
              enableReinitialize={true}
              initialValues={formData}
              onSubmit={handleSubmit}
              validationSchema={reviewSchema}
            >
              <Form>
                <div className="mb-3 form-group">
                  <Field
                    component="input"
                    className="form-control"
                    id="subject"
                    name="subject"
                    placeholder="Enter a title"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    style={{
                      width: "100%",
                      marginTop: "0.25rem",
                      fontSize: "80%",
                      color: "#dc3545",
                    }}
                  />
                </div>
                <div className="mb-3 form-group">
                  <Field
                    component="textarea"
                    className="form-control"
                    id="text"
                    name="text"
                    placeholder="Enter a review"
                  />
                  <ErrorMessage
                    name="text"
                    component="div"
                    style={{
                      width: "100%",
                      marginTop: "0.25rem",
                      fontSize: "80%",
                      color: "#dc3545",
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Review;

Review.propTypes = {
  entityId: PropTypes.number.isRequired,
  updater: PropTypes.func.isRequired,
  editReview: PropTypes.shape({
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
};
