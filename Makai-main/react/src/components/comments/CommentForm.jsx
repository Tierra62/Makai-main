import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Col } from "react-bootstrap";
import debug from "sabio-debug";
import commentsService from "../../services/commentsService";
import { commentsSchema } from "../../schemas/commentsSchema";
import toastr from "toastr";
import PropTypes from "prop-types";
const _logger = debug.extend("CommentForm");

function CommentForm(props) {
  const { entityId, entityTypeId } = props;
  _logger("CommentParent props", props);

  const [comments, setComments] = useState({
    list: [],
    mappedComments: [],
  });

  const formData = {
    entityId: entityId,
    entityTypeId: entityTypeId,
    subject: "",
    text: "",
  };

  useEffect(() => {
    commentsService
      .getByEntity(entityId, entityTypeId)
      .then(onGetCommentsSuccess)
      .catch(onGetCommentsError);
  }, [entityId, entityTypeId]);

  const handleSubmit = (values) => {
    _logger(values);
    const payload = {
      ...values,
      subject: values.subject || "No subject",
    };
    commentsService
      .addComment(payload)
      .then(onHandleSubmitSuccess)
      .catch(onHandleSubmitError);
  };

  const onHandleSubmitSuccess = (response) => {
    toastr.success("Comment Created");
    _logger("onHandleSubmitSuccess", response);

    setComments((prevComments) => {
      let newState = { ...prevComments };
      newState.list = [...prevComments.list];
      newState.list.unshift(response.payload);
      newState.mappedComments = newState.list.map(mappedComment);
      return newState;
    });
  };

  function mappedComment(comment) {
    return (
      <Col xs={12} md={6} style={{ marginBottom: "10px", margin: "auto" }}>
        <div key={`comment-${comment.id}`} className="card mb-3">
          <div className="card-body">
            <p className="card-text">{comment.text}</p>
          </div>
        </div>
      </Col>
    );
  }

  const onHandleSubmitError = (error) => {
    toastr.error("Comment submit error");
    _logger(error);
  };

  const onGetCommentsSuccess = (response) => {
    setComments((prevComments) => {
      let newerState = { ...prevComments };
      newerState.list = response.item;
      newerState.mappedComments = newerState.list.map(mappedComment);
      _logger("akjshdkadsh", newerState.list);

      return newerState;
    });
  };

  const onGetCommentsError = (error) => {
    _logger(error);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-4" style={{ margin: "auto" }}>
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            validationSchema={commentsSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Col xs={12}>
                <div>
                  <label htmlFor="text">Text</label>
                  <Field
                    className="form-control"
                    type="textarea"
                    component="textarea"
                    id="text"
                    name="text"
                  />
                </div>
              </Col>
              <div>
                <button
                  type="submit"
                  className="btn btn-secondary mb-6 w-25 align-self-center"
                >
                  Comment
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div>{comments?.mappedComments}</div>
      </div>
    </div>
  );
}

CommentForm.propTypes = {
  entityId: PropTypes.number.isRequired,
  entityTypeId: PropTypes.number.isRequired,
};

export default CommentForm;
