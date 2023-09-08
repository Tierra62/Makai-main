import React, { useEffect, useState } from "react";
import debug from "sabio-debug";
import surveysService from "services/surveysService";
import surveyInstanceService from "services/surveyInstanceService";
import surveyAnswerService from "services/surveyAnswerService";
import toastr from "toastr";
import { Formik, Form, FieldArray, Field } from "formik";
import swal from "sweetalert";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  Form as BootstrapForm,
  Button,
} from "react-bootstrap";

const Survey = () => {
  const _logger = debug.extend("Survey.jsx");
  const [formData, setFormData] = useState({
    survey: {},
    instance: {
      surveyId: 32,
      userId: null,
      dateCreated: "",
      dateModified: "",
    },
    answers: [],
  });

  const handleSubmit = () => {
    _logger("Form Submitted", formData.instance);
    surveyInstanceService
      .add(formData.instance)
      .then(onAddSurveyInstanceSuccess)
      .catch(onAddSurveyInstanceError);
  };

  useEffect(() => {
    surveysService
      .getSurveyDetails(32)
      .then(onGetSurveyDetailsSuccess)
      .catch(onGetSurveyDetailsError);
  }, []);

  const onAddSurveyInstanceSuccess = (data) => {
    _logger("Successfully added Instance!", data);

    const fd = { ...formData };
    fd.answers = fd.answers.map((answer) => {
      return {
        ...answer,
        instanceId: data.item,
      };
    });

    surveyAnswerService
      .add(fd.answers)
      .then(onAddSurveyAnswersSuccess)
      .catch(onAddSurveyAnswersError);
  };

  const onAddSurveyInstanceError = (error) => {
    _logger("Failed to add Instance!", error);
    toastr.error("error");
  };

  const onAddSurveyAnswersSuccess = (data) => {
    _logger("Successfully added Answers!", data);
    swal({
      title: "Survey Submitted!",
      text: "Thank you for your feedback!",
      icon: "success",
      button: "Close",
    });
  };

  const onAddSurveyAnswersError = (error) => {
    _logger("Failed to add Answers!", error);
    toastr.error("error");
  };

  const onGetSurveyDetailsSuccess = (data) => {
    _logger("Success!", data);

    setFormData((prevState) => {
      const fd = { ...prevState };
      fd.survey = data;
      fd.instance = {
        surveyId: data.item?.id,
        userId: 3,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      };
      fd.answers = data.item.questions.map((question) => ({
        instanceId: null,
        questionId: question.id,
        answerOptionId: null,
        answer: "",
        answerNumber: null,
        questionType: question.type,
      }));
      {
      }
      return fd;
    });
  };

  const onGetSurveyDetailsError = (error) => {
    _logger("Failed to get Survey!", error);
    toastr.error("error");
  };

  return (
    <>
      <Container>
        <Row className="justify-content-md-center mt-3">
          <Col md="8">
            <Card className="shadow-lg p-3 mb-5 bg-white rounded">
              <Card.Header>
                <h2>{formData.survey?.item && formData.survey?.item?.name}</h2>
              </Card.Header>
              <Card.Body>
                <Formik
                  enableReinitialize={true}
                  initialValues={formData.answers}
                  onSubmit={handleSubmit}
                >
                  {({}) => (
                    <Form>
                      <FieldArray name="answers">
                        {({}) => (
                          <div>
                            {formData.survey?.item?.questions.map(
                              (question, index) => (
                                <div className="mb-3" key={question.id}>
                                  <BootstrapForm.Label>
                                    {question.question}
                                  </BootstrapForm.Label>
                                  <Row>
                                    {question.type === 1 &&
                                      question.answerOptions.map((option) => (
                                        <Col key={option.id}>
                                          <BootstrapForm.Check
                                            inline
                                            type="radio"
                                            name={`answers[${index}].answerOptionId`}
                                            value={option.value}
                                            onChange={() =>
                                              setFormData((prevState) => {
                                                const fd = { ...prevState };
                                                fd.answers[index] = {
                                                  ...fd.answers[index],
                                                  answerOptionId: option.id,
                                                  answer: option.text,
                                                  answerNumber: option.value,
                                                };
                                                return fd;
                                              })
                                            }
                                            label={option.text}
                                          />
                                        </Col>
                                      ))}
                                    {question.type === 2 && (
                                      <Col>
                                        <Field
                                          className="form-control"
                                          component="select"
                                          name={`answers[${index}].answerOptionId`}
                                          onChange={() =>
                                            setFormData((prevState) => {
                                              const fd = { ...prevState };
                                              fd.answers[index] = {
                                                ...fd.answers[index],
                                                answerOptionId: 1,
                                                answer: "Google",
                                                answerNumber: 1,
                                              };
                                              return fd;
                                            })
                                          }
                                        >
                                          <option value="null">
                                            Choose...
                                          </option>
                                          {question.answerOptions.map(
                                            (option) => (
                                              <option
                                                key={option.id}
                                                value={option.value}
                                              >
                                                {option.text}
                                              </option>
                                            )
                                          )}
                                        </Field>
                                      </Col>
                                    )}
                                    {question.type === 3 && (
                                      <Col>
                                        <Field
                                          type="text"
                                          name={`answers[${index}].answer`}
                                          placeholder="Enter Your Answer"
                                          onChange={() =>
                                            setFormData((prevState) => {
                                              const fd = { ...prevState };
                                              fd.answers[index] = {
                                                ...fd.answers[index],
                                                answerOptionId: 1,
                                                answerNumber: 1,
                                                answer: "Great!",
                                              };
                                              return fd;
                                            })
                                          }
                                          className="form-control"
                                        />
                                      </Col>
                                    )}
                                  </Row>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </FieldArray>
                      <Button type="submit" variant="primary" className="mt-3">
                        Submit
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
Survey.propTypes = {
  survey: PropTypes.shape({
    question: PropTypes.shape({
      question: PropTypes.string,
      type: PropTypes.number,
      answerOptions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          instanceId: PropTypes.number,
          questionId: PropTypes.number,
          answerOptionId: PropTypes.number,
          answer: PropTypes.string,
          answerNumber: PropTypes.number,
        })
      ),
    }),
    index: PropTypes.number,
    formik: PropTypes.shape({
      handleChange: PropTypes.func,
    }),
  }),
};
export default Survey;
