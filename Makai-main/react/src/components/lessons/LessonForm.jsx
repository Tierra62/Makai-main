import React, { useState, useEffect } from "react";
import lessonService from "../../services/lessonService";
import lookUpService from "../../services/lookUpService";
import toastr from "toastr";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import { LessonSchema } from "schemas/lessonSchema";
import { Col, Row, Form as Bform } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const _logger = debug.extend("LessonsView");

const LessonForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [userFormData] = useState({
    siteTrainingId: state?.payload?.siteTrainingId || 0,
    title: state?.payload?.title || "",
    subject: state?.payload?.subject || "",
    summary: state?.payload?.summary || "",
    duration: state?.payload?.duration || "",
    coverImageUrl: state?.payload?.coverImageUrl || "",
    lessonTypeId: state?.payload?.lessonTypeId || 0,
    mediaUrl: state?.payload?.mediaUrl || "",
  });

  const [arrayData, setArrayData] = useState({
    siteTrainingsComponent: [],
    siteTrainings: [],
  });

  _logger(state, "this is state");

  useEffect(() => {
    lookUpService
      .LookUp(["SiteTrainings_Basic"])
      .then(onLookUpSuccess)
      .catch(onLookUpError);
  }, []);

  const onLookUpSuccess = (response) => {
    _logger(response);
    _logger(arrayData, setArrayData);
    const siteTrainings = response.item.siteTrainings_Basic;

    setArrayData((prevState) => {
      const newState = { ...prevState };
      newState.siteTrainings = siteTrainings;
      newState.siteTrainingsComponent = siteTrainings.map(mapSiteTrainings);
      return newState;
    });
  };

  const mapSiteTrainings = (siteTraining) => {
    return (
      <option value={siteTraining.id} key={siteTraining.id}>
        {siteTraining.name}
      </option>
    );
  };

  const onLookUpError = (response) => {
    _logger(response, "could not get trainings");
  };

  _logger(userFormData);

  const siteTrainingId = state?.payload?.siteTrainingId;
  const lessonId = state?.payload?.id;
  const onLessonSubmit = (values) => {
    _logger("submitting", siteTrainingId, lessonId);
    const payload = values;
    const type = state?.type;
    if (lessonId && type === "LESSON_EDIT") {
      _logger(payload, lessonId, "this is what we are sending");
      lessonService
        .updateLesson(payload, lessonId)
        .then(successEditLesson)
        .catch(errorEditLesson);
    } else {
      lessonService
        .createLesson(payload)
        .then(successAddLesson)
        .catch(errorAddLesson);
    }
  };

  function successAddLesson() {
    toastr.success("New Lesson Created");
    navigate(`/training/list`);
  }
  function errorAddLesson(response) {
    toastr.error("Could Not Create Lesson");
    _logger(response, "response from server");
  }
  function successEditLesson() {
    toastr.success("This lesson has been updated");
    navigate(`/training/${siteTrainingId}/lessons`);
  }
  function errorEditLesson(response) {
    toastr.error("Could not update lesson");
    _logger(response, "could not update");
  }

  return (
    <div className="container contact-container-bot d-flex flex-column mt-7 text-white">
      <h4
        className="contact-header top-0 start-100 fw-bold align-self-center fs-5 text-white
        "
      >
        Create or Edit a Lesson
      </h4>
      <p id="quote" className="text-center">
        Use this form to create/edit lessons!
      </p>
      <div className="col contact-col-bot">
        <Formik
          enableReinitialize={true}
          initialValues={userFormData}
          onSubmit={onLessonSubmit}
          validationSchema={LessonSchema}
        >
          <Form>
            <div className="row contact-row-bot">
              <Row className="align-items-center g-3 mb-4">
                <Col xs={6}>
                  <Bform.Group>
                    <Bform.Label htmlFor="title">Title</Bform.Label>
                    <Field
                      className="Bform.Control rounded p-3 w-100 "
                      id="title"
                      placeholder="Title"
                      type="text"
                      name="title"
                    />
                    <ErrorMessage
                      name="title"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>
                <Col xs={6}>
                  <Bform.Group>
                    <Bform.Label htmlFor="subject">Subject</Bform.Label>

                    <Field
                      type="text"
                      className="Bform.Control rounded p-3 w-100 "
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                    />
                    <ErrorMessage
                      name="subject"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>
                <Col xs={12}>
                  <Bform.Group>
                    <Bform.Label htmlFor="summary">Summary</Bform.Label>
                    <Field
                      className="Bform.Control rounded p-3 w-100 "
                      type="text"
                      id="summary"
                      name="summary"
                      placeholder="Summary"
                    />
                    <ErrorMessage
                      name="summary"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>
                <Col xs={6}>
                  <Bform.Group>
                    <Bform.Label htmlFor="duration">Duration</Bform.Label>

                    <Field
                      className="Bform.Control rounded p-3 w-100 "
                      type="text"
                      id="duration"
                      name="duration"
                      placeholder="Duration"
                    />
                    <ErrorMessage
                      name="duration"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>
                <Col xs={6}>
                  <Bform.Group>
                    <Bform.Label htmlFor="coverImageUrl">
                      Cover Image Url
                    </Bform.Label>
                    <Field
                      className="Bform.Control rounded p-3 w-100 "
                      type="text"
                      id="coverImageUrl"
                      name="coverImageUrl"
                      placeholder="Cover Image Url"
                    />
                    <ErrorMessage
                      name="coverImageUrl"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>
                <Col xs={6}>
                  <Bform.Group>
                    <Bform.Label htmlFor="lessonTypeId">
                      Lesson Type
                    </Bform.Label>
                    <Field
                      component="select"
                      className="B.form.Control rounded p-3 w-100"
                      name="lessonTypeId"
                      type="number"
                    >
                      <option value={0}>Lesson Type</option>
                      <option value={1}>Video</option>
                      <option value={2}>Audio</option>
                      <option value={3}>Pdf</option>
                      <option value={4}>Text</option>
                    </Field>
                    <ErrorMessage
                      name="lessonTypeId"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>
                <Col xs={6}>
                  <Bform.Group>
                    <Bform.Label htmlFor="mediaUrl">Media Url</Bform.Label>
                    <Field
                      className="Bform.Control rounded p-3 w-100 "
                      type="mediaUrl"
                      id="mediaUrl"
                      name="mediaUrl"
                      placeholder="Media Url"
                    />
                    <ErrorMessage
                      name="mediaUrl"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>
                {!lessonId && (
                  <Col xs={6}>
                    <Bform.Group>
                      <Bform.Label htmlFor="siteTrainingId">
                        Training Type
                      </Bform.Label>
                      <Field
                        component="select"
                        className="B.form.Control rounded p-3 w-100"
                        name="siteTrainingId"
                        type="text"
                        id="siteTrainingId"
                      >
                        <option value={0}>Training Type</option>
                        {arrayData.siteTrainingsComponent}
                      </Field>
                      <ErrorMessage
                        name="siteTrainingId"
                        component="Bform.Group"
                        className="has-error"
                      />
                    </Bform.Group>
                  </Col>
                )}
              </Row>
              <Row>
                <Col className="text-center">
                  {" "}
                  <button
                    type="submit"
                    className="btn btn-primary mb-6 w-25 align-self-center"
                  >
                    Submit Lesson
                  </button>
                </Col>
              </Row>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LessonForm;
