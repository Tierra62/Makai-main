import React, { useState, useEffect, useCallback } from "react";
import lessonService from "../../services/lessonService";
import lookUpService from "../../services/lookUpService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import { Col, Row, Form as Bform, Container } from "react-bootstrap";
import LessonCard from "./LessonCard";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";

const _logger = debug.extend("training");

const LessonPage = (props) => {
  const siteId = useParams();
  const [pageData, setPageData] = useState({
    siteTrainings: [],
    arrayOfLessons: [],
    lessonComponent: [],
    siteTrainingsComponent: [],
    pageIndex: 0,
    pageSize: 10,
  });
  const [formData, setFormData] = useState({ siteTrainingId: 0 });

  const navigate = useNavigate();

  _logger(siteId.id, "These are the useParams");

  useEffect(() => {
    _logger(siteId, "this is inside useEffect");
    lookUpService
      .LookUp(["SiteTrainings_Basic"])
      .then(onLookUpSuccess)
      .catch(onLookUpError);

    if (siteId) {
      lessonService
        .getBySiteTrainingId(pageData.pageIndex, pageData.pageSize, siteId.id)
        .then(onGetLessonsSuccess)
        .catch(onGetLessonsError);
    }
  }, []);

  useEffect(() => {
    _logger("useEffect is running");
    if (siteId.id > 0) {
      setFormData((prevState) => {
        let ns = { ...prevState };
        ns.siteTrainingId = siteId.id;
        return ns;
      });
    }
  }, []);

  const onLookUpSuccess = (response) => {
    _logger(response);
    _logger(pageData, setPageData);
    const siteTrainings = response.item.siteTrainings_Basic;

    setPageData((prevState) => {
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
    _logger(response, "could not get lessons");
  };

  const onGetLessonsSuccess = (response) => {
    _logger(response);
    const arrayOfLessons = response.item.pagedItems;

    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.arrayOfLessons = arrayOfLessons;
      newState.lessonComponent = arrayOfLessons.map(mapLesson);

      return newState;
    });
  };

  const onGetLessonsError = (response) => {
    _logger(response, "Could not get lessons");
  };

  const onDeleteRequested = useCallback((theLesson, e) => {
    _logger(theLesson.id, { theLesson, e });

    const handler = getDeleteSuccessHandler(theLesson.id);

    lessonService.deleteLesson(theLesson.id).then(handler).catch(onDeleteError);
  }, []);

  const getDeleteSuccessHandler = (idToBeDeleted) => {
    _logger("getDeleteSuccessHandler", idToBeDeleted);

    return () => {
      _logger("onDeleteSuccess", idToBeDeleted);

      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.arrayOfLessons = [...pd.arrayOfLessons];

        const indexOf = pd.arrayOfLessons.findIndex((lesson) => {
          let result = false;

          if (lesson.id === idToBeDeleted) {
            result = true;
          }

          return result;
        });

        if (indexOf >= 0) {
          pd.arrayOfLessons.splice(indexOf, 1);
          pd.lessonComponent = pd.arrayOfLessons.map(mapLesson);
        }
        _logger(indexOf, "this is index of");
        return pd;
      });
    };
  };

  const onDeleteError = (response) => {
    _logger(response, "could not delete lesson");
  };

  const mapLesson = (aLesson) => {
    return (
      <LessonCard
        lesson={aLesson}
        key={aLesson.id}
        userRoles={props.currentUser.roles}
        onDeleteClicked={onDeleteRequested}
      ></LessonCard>
    );
  };

  const onTrainingSelected = (values) => {
    _logger(values, "The are the values");
    const selectedCategory = values.siteTrainingId;
    lessonService
      .getBySiteTrainingId(
        pageData.pageIndex,
        pageData.pageSize,
        selectedCategory
      )

      .then(onGetLessonsSuccess)
      .catch(onGetLessonsError);
    _logger("this is the event", e.target.value);
  };
  const navigateBack = () => {
    navigate("/training/list");
  };

  const navigateToForm = () => {
    navigate("/training/lessons/form");
  };

  return (
    <div className="container contact-container-bot d-flex flex-column mt-7 text-white">
      <h4
        className="contact-header top-0 start-100 fw-bold align-self-center fs-5 text-white
                "
      >
        Training Lessons
      </h4>
      <p id="quote" className="text-center">
        We offer many lessons!
      </p>
      <div className="col contact-col-bot">
        <Formik
          enableReinitialize={true}
          initialValues={formData}
          onSubmit={onTrainingSelected}
        >
          <Form>
            <div className="row contact-row-bot ps-4">
              <Row className="align-items-center g-3 mb-4">
                <Col xs={6}>
                  <Bform.Group>
                    <Bform.Label htmlFor="siteTrainingId">
                      Select what you wish to learn about
                    </Bform.Label>
                    <Field
                      as="select"
                      className="B.form.Control rounded p-3 w-100"
                      name="siteTrainingId"
                      type="number"
                      id="siteTrainingId"
                    >
                      <option value={0}>Select Training</option>
                      {pageData.siteTrainingsComponent}
                    </Field>
                    <ErrorMessage
                      name="siteTrainingId"
                      component="Bform.Group"
                      className="has-error"
                    />
                  </Bform.Group>
                </Col>

                <Col className="align-items-center g-5 mb-0 ">
                  <button type="submit" className="btn btn-primary p-3 mx-2">
                    Show Lessons
                  </button>
                  <button
                    type="button"
                    className="btn btn-info p-3 mx-2"
                    onClick={navigateBack}
                  >
                    Back to Trainings
                  </button>
                  <button
                    type="button"
                    className="btn btn-info p-3 mx-2"
                    onClick={navigateToForm}
                  >
                    Create a Lesson
                  </button>
                </Col>
              </Row>
            </div>
          </Form>
        </Formik>
        <Container>
          <Row>{pageData.lessonComponent}</Row>
        </Container>
      </div>
    </div>
  );
};

LessonPage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default LessonPage;
