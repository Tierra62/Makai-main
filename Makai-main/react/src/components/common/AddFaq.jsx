import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { faqFormSchema } from "schemas/faqFormSchema";
import { useLocation, useNavigate } from "react-router-dom";
import lookUpService from "services/lookUpService";
import faqsService from "services/faqsService";
import "./faq.css";
import toastr from "toastr";
import debug from "sabio-debug";
import { Card, Col, Row } from "react-bootstrap";

const _logger = debug.extend("AddFaq");

function AddFaq() {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [faqData, setFaqData] = useState({
    question: "",
    answer: "",
    faqCategory: 0,
  });

  const [faqsCategoryData, setFaqsCategoryData] = useState({
    faqsCategory: [],
    faqsCategoryComponents: [],
  });

  useEffect(() => {
    lookUpService
      .LookUp(["FAQCategories"])
      .then(onGetCategorySuccess)
      .catch(onGetCategoryError);
  }, []);

  const mapFaqCategory = (aFaqCategory) => {
    return (
      <option value={aFaqCategory.id} key={`faqCategory_${aFaqCategory.id}`}>
        {aFaqCategory.name}
      </option>
    );
  };

  const onGetCategorySuccess = (item) => {
    const arrayOfFaqsCategories = item.item.faqCategories;

    setFaqsCategoryData((prevState) => {
      const categoryItem = { ...prevState };

      categoryItem.faqsCategory = arrayOfFaqsCategories;
      categoryItem.faqsCategoryComponents =
        arrayOfFaqsCategories.map(mapFaqCategory);

      return categoryItem;
    });
  };

  const onGetCategoryError = () => {
    toastr.error("Cant load Categories");
  };

  useEffect(() => {
    if (state) {
      setFaqData((prevState) => {
        _logger("faq updating");
        let faqData = { ...prevState };
        faqData.question = state.stateForTransports?.payload?.question;
        faqData.answer = state.stateForTransports?.payload?.answer;

        return faqData;
      });
    }
  }, []);

  const handleSubmit = (values) => {
    values.faqCategory = Number(values.faqCategory);

    const payload = {
      question: values.question,
      answer: values.answer,
      categoryId: values.faqCategory,
      sortOrder: 10,
    };

    faqsService
      .addFaq(payload)
      .then(onHandleSubmitSuccess)
      .catch(onHandleSubmitError);
  };

  const onHandleSubmitSuccess = (response) => {
    _logger({ faqData: response });

    navigate(`/faqs`);
    toastr.success("Added new FAQ");
  };

  const onHandleSubmitError = (error) => {
    _logger({ error: error });
    toastr.error("Did not add new FAQ");
  };

  return (
    <>
      <Card className="p-3">
        <h2>Create FAQs</h2>
        <Formik
          enableReinitialize={true}
          initialValues={faqData}
          onSubmit={handleSubmit}
          validationSchema={faqFormSchema}
        >
          <Form>
            <div className="form-group">
              <label>Add a new question:</label>
              <Field
                name="question"
                type="text"
                className="form-control faq-form-input "
              />
              <ErrorMessage
                name="question"
                component="div"
                className="has-error"
              />

              <div className="mt-3 form-group">
                <label>Add answer:</label>
                <Field
                  name="answer"
                  type="text"
                  className="form-control input"
                />
                <ErrorMessage
                  name="answer"
                  component="div"
                  className="has-error"
                />
                <Row className="mt-4">
                  <Col className="col-3">
                    <label className="m-3 form-label">Choose A Category</label>
                  </Col>
                  <Col className="col-3 mt-2">
                    <Field
                      as="select"
                      name="faqCategory"
                      className="form-select"
                    >
                      <option>Select Category</option>
                      {faqsCategoryData.faqsCategoryComponents}
                    </Field>
                  </Col>
                </Row>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Submit
            </button>
          </Form>
        </Formik>
      </Card>
    </>
  );
}

export default AddFaq;
