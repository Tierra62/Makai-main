import React, { useState } from "react";
import debug from "sabio-debug";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { shareStorySchema } from "../../schemas/shareStorySchema";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ShareStoryPreview from "./ShareStoryPreview";
import { Link } from "react-router-dom";
import { addStory } from "services/sharedStoriesService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import PropTypes from "prop-types";
import FileUploader from "components/FileUploader";

const _logger = debug.extend("story");

function ShareStoryForm(props) {
  _logger("a", props);

  const [story] = useState({
    email: props.currentUser.email,
    story: "",
    name: "",
    fileId: 0,
  });

  const handleSubmit = (values, { resetForm }) => {
    _logger("handleSubmit", values);

    addStory(values)
      .then((response) => onAddSuccess(response, resetForm))
      .catch(onAddError);
  };

  const onAddSuccess = (response, resetForm) => {
    _logger(response, "Add Story success");

    Toastify({
      text: "Story has been created",
      className: "Success",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
    resetForm();
  };

  const onAddError = (error) => {
    _logger(error, "Add story error");

    Toastify({
      text: "Error with creating a story",
      className: "Error",
      style: {
        background: "linear-gradient(to right, #ff3703, #ff5903)",
      },
    }).showToast();
  };

  const onAddImage = (setFieldValue, values) => {
    _logger(setFieldValue, values);
    values.items && setFieldValue("image", values.items[0].url);
    values.items && setFieldValue("fileId", values.items[0].id);
  };

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={story}
        onSubmit={handleSubmit}
        validationSchema={shareStorySchema}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="container-fluid p-0">
              <div className="row">
                <div className="mb-2 col-6 col-lg-6 col-md-6">
                  <div className="card p-3">
                    <div className="form-group">
                      <div className="form-group">
                        <label>Add Image to Story</label>
                        <FileUploader
                          onUploadSuccess={(response) =>
                            onAddImage(setFieldValue, response)
                          }
                        />
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div>
                        <label className="form-label" htmlFor="titleLabel">
                          Title
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="url">Story</label>
                      <CKEditor
                        name="story"
                        editor={ClassicEditor}
                        data={values.story}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          _logger({ event, editor, data });
                          setFieldValue("story", data);
                        }}
                        onReady={(editor) => {
                          editor.editing.view.change((writer) => {
                            writer.setStyle(
                              "height",
                              "200px",
                              editor.editing.view.document.getRoot()
                            );
                          });
                        }}
                      />
                    </div>
                    <div className="form-group d-none">
                      <label htmlFor="subjectLabel">Email</label>
                      <Field
                        type="text"
                        name="email"
                        className="form-control"
                        value={props.currentUser.email}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="form-group d-none">
                      <label className="form-label" htmlFor="titleLabel">
                        fileId
                      </label>
                      <Field
                        type="text"
                        name="fileId"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="fileId"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mt-2">
                      <button type="submit" className="btn btn-primary  btn-sm">
                        Submit
                      </button>
                      <Link to="/social/sharestories">
                        <button className="btn btn-secondary btn-sm float-end">
                          Go Back to Stories
                        </button>
                      </Link>
                    </div>
                    <div className="float-right"> </div>
                  </div>
                </div>
                <div className="mb-2 col-xl-6 col-lg-6 col-md-6">
                  <ShareStoryPreview
                    data={{ ...values }}
                    currentUser={props.currentUser}
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
}

ShareStoryForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShareStoryForm;
