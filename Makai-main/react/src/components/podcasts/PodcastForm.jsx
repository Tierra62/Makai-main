import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as podcastsService from "services/podcastService";
import debug from "sabio-debug";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { podcastSchema } from "../../schemas/podcastSchema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const _logger = debug.extend("podcast");

function PodcastForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  _logger(state);

  const handleSubmit = (values) => {
    _logger("submitting", values);
    const payload = values;
    const id = state?.payload?.id;
    if (id) {
      podcastsService
        .editPodcast(id, payload)
        .then(onEditPodcastSuccess)
        .catch(onEditPodcastError);
    } else {
      podcastsService
        .addPodcast(payload)
        .then(onSuccessPodcastServices)
        .catch(onErrorPodcastServices);
    }
  };

  const onEditPodcastSuccess = (response) => {
    _logger(response);
    navigate("/social/podcasts");
  };
  const onEditPodcastError = (response) => {
    _logger(response);
  };
  const onSuccessPodcastServices = (response) => {
    _logger(response);
    navigate("/social/podcasts");
  };
  const onErrorPodcastServices = (response) => {
    _logger(response);
  };

  return (
    <React.Fragment>
      <div className="container mx-auto">
        <h5 className="podcast-header text-center fw-bold fs-2 mb-6">
          Podcast Submission Form
        </h5>
        <Formik
          enableReinitialize={true}
          initialValues={{
            title: state?.payload?.title || "",
            link: state?.payload?.link || "",
            coverPhoto: state?.payload?.coverPhoto || "",
            description: state?.payload?.description || "",
            date: state?.payload?.date ? new Date(state?.payload.date) : "",
          }}
          onSubmit={handleSubmit}
          validationSchema={podcastSchema}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="title">
                  Title
                </label>
                <div className="col-sm-10">
                  <Field
                    className="form-control"
                    id="title"
                    type="text"
                    name="title"
                  />
                  <ErrorMessage name="title" />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="link">
                  Link
                </label>
                <div className="col-sm-10">
                  <Field
                    className="form-control"
                    id="link"
                    type="text"
                    name="link"
                  />
                  <ErrorMessage name="link" />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="coverPhoto">
                  Cover Photo
                </label>
                <div className="col-sm-10">
                  <Field
                    className="form-control"
                    id="coverPhoto"
                    type="text"
                    name="coverPhoto"
                  />
                  <ErrorMessage name="link" />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  className="col-sm-2 col-form-label"
                  htmlFor="description"
                >
                  Description
                </label>
                <div className="col-sm-10">
                  <Field
                    className="form-control"
                    id="description"
                    as="textarea"
                    name="description"
                  />
                  <ErrorMessage name="link" />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  className="col-sm-2 col-form-label"
                  htmlFor="basic-form-dob"
                >
                  Date
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    wrapper
                    className="form-control"
                    showIcon
                    selected={values.date}
                    onChange={(date) => setFieldValue("date", date)}
                  />
                  <ErrorMessage name="link" />
                </div>
              </div>
              <button className="btn btn-success me-1 mb-1" type="submit">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  );
}
export default PodcastForm;
