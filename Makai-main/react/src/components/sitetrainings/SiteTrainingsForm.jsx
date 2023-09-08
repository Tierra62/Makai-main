import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { siteTrainingFormSchema } from "schemas/siteTrainingFormSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import FormPreview from "./FormPreview";
import toastr from "toastr";
import siteTrainingService from "services/siteTrainingService";
import lookUpService from "services/lookUpService";
import sabioDebug from "sabio-debug";
import "./SiteTraining.css";
import { useNavigate } from "react-router-dom";
import FileUploader from "components/FileUploader";

const _logger = sabioDebug.extend("training");
const SiteTrainingsForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImageUrl: "",
    categoryId: 3,
  });

  const onSubmitTraining = (data) => {
    _logger(formData);
    if (formData.id) {
      siteTrainingService
        .onUpdateTraining(data.id, data)
        .then(onUpdateTrainingSuccess)
        .catch(onUpdateTrainingError);
    } else {
      siteTrainingService
        .trainingInsert(data)
        .then(onSubmitTrainingSuccess)
        .catch(onSubmitTrainingError);
    }
  };
  const navigate = useNavigate();

  const onSubmitTrainingSuccess = (response) => {
    _logger(response);
    toastr.success("Training add was successful");
    navigate("/training/list");
  };
  const onSubmitTrainingError = (error) => {
    _logger(error);
    swal("Training add was unsuccessful", "Please try again.", "error");
  };

  const onUpdateTrainingSuccess = (response) => {
    _logger(response);
    toastr.success("You have successfully updated the training!");
    navigate("/training/list");
  };
  const onUpdateTrainingError = (error) => {
    _logger(error);
    swal("Training edit was unsuccessful", "Please try again.", "error");
  };

  const location = useLocation();

  useEffect(() => {
    if (location?.state?.type === "Training_Edit" && location.state.payload) {
      setFormData((prevState) => {
        _logger(prevState, location.state.payload);
        const training = { ...prevState, ...location.state.payload };
        return training;
      });
    }
  }, []);

  useEffect(() => {
    lookUpService
      .LookUp(["TrainingCategories"])
      .then(onGetLookUpSuccess)
      .catch(onGetLookUpError);
  }, []);

  const onGetLookUpSuccess = (data) => {
    _logger(data);
    let training = data.item.trainingCategories;
    _logger(training);
    setTrainings((prevState) => {
      let pd = { ...prevState };
      pd.trainingsMapped = training.map(mapFromLookUp);
      pd.trainingPreview = training.reduce((newTrainingObj, aTraining) => {
        newTrainingObj[aTraining.id] = aTraining.name;
        return newTrainingObj;
      }, {});
      return pd;
    });
  };

  const mapFromLookUp = (training) => {
    return (
      <option key={training.id} value={training.id}>
        {training.name}
      </option>
    );
  };

  const onGetLookUpError = (error) => {
    _logger("Error on lookup Service", error);
    toastr.error("Your Category topics could not be found");
  };

  const [trainings, setTrainings] = useState({
    trainingsMapped: [],
    trainingPreview: {},
  });

  const onAddImage = (setFieldValue, response) => {
    _logger(response);
    response.items && setFieldValue("coverImageUrl", response.items[0].url);
  };
  return (
    <Container className="training-container">
      <Formik
        enableReinitialize={true}
        initialValues={formData}
        validationSchema={siteTrainingFormSchema}
        onSubmit={onSubmitTraining}
        value="Reset"
      >
        {({ setFieldValue, values }) => (
          <Row className="training-row-form">
            <h1 className="training-header">Add New Site Training</h1>
            <Col className="training-col-form">
              <Col>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Training List</Tooltip>}
                >
                  <Link to="/training/list">
                    <Button className="training-form-icongrid">
                      Training List {""}
                      <FontAwesomeIcon
                        icon={faTh}
                        className="training-form-icongrid"
                      />
                    </Button>
                  </Link>
                </OverlayTrigger>
              </Col>
              <FormikForm className="mb-2 col-xl-6 col-lg-12 col-md-12 training-form">
                <Form.Group className="mb-3">
                  <FileUploader
                    onUploadSuccess={(response) =>
                      onAddImage(setFieldValue, response)
                    }
                  />
                  <ErrorMessage
                    name="coverImageUrl"
                    component="div"
                    className="has-error"
                  ></ErrorMessage>
                </Form.Group>

                <Row className="g-2 mb-3 training-form-body">
                  <Form.Group className="mb-3" as={Col} sm={6}>
                    <Form.Label htmlFor="title"> Title</Form.Label>
                    <Field
                      placeholder="Title of the training exercise."
                      name="title"
                      type="text"
                      className="form-control"
                    ></Field>
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="has-error"
                    ></ErrorMessage>
                  </Form.Group>

                  <Form.Group className="mb-3" as={Col} sm={6}>
                    <Form.Label>Select Category</Form.Label>
                    <Field
                      name="categoryId"
                      as="select"
                      className="form-select"
                    >
                      <option name="categoryId" className="text-muted">
                        Category Name
                      </option>
                      {trainings.trainingsMapped}
                    </Field>
                    <ErrorMessage
                      name="categoryId"
                      component="div"
                      className="has-error"
                    ></ErrorMessage>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="description">Description</Form.Label>
                    <Field
                      placeholder="A description of what the training exercise/lesson is about is necessary."
                      name="description"
                      className="form-control"
                      type="text-area"
                      as="textarea"
                      rows={3}
                    ></Field>
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="has-error"
                    ></ErrorMessage>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-4 training-form-buttons">
                  <Button className="w-25" type="submit">
                    {formData.id ? "Edit" : "Submit"}
                  </Button>
                  <Button className="w-25 training-reset-button" type="reset">
                    Reset
                  </Button>
                </Form.Group>
              </FormikForm>
            </Col>
            <FormikForm className="mb-2 col-xl-6 col-lg-12 col-md-12 form-card">
              <FormPreview
                training={{
                  ...values,
                  category: trainings.trainingPreview[values.categoryId],
                }}
              ></FormPreview>
            </FormikForm>
          </Row>
        )}
      </Formik>
    </Container>
  );
};
export default SiteTrainingsForm;
