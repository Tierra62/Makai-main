import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import recommendationsService from "services/recommendationsService";
import newRecommendationFormSchema from "schemas/newRecommendationFormSchema";
import lookUpService from "services/lookUpService";
import "./recommendations.css";

const _logger = debug.extend("NewRecomm");

function NewRecommendation() {
  const navigate = useNavigate();
  // State
  const [newRecommState] = useState({
    formData: {
      partnerId: "",
      sourceProductId: "",
      targetProductId: "",
      reason: "",
    },
  });
  const [products, setProducts] = useState({
    mappedProducts: [],
  });

  const [partners, setPartners] = useState({
    mappedPartners: [],
  });

  const navigateToViewRecommendations = () => {
    navigate(`/recommendations/view`);
  };

  useEffect(() => {
    lookUpService
      .LookUp(["Products", "Partners"])
      .then(onLookupSuccess)
      .catch(onLookupError);
  }, []);

  const onLookupSuccess = (data) => {
    let productList = data.item.products;
    let partnerList = data.item.partners;
    _logger(productList, partnerList);
    setProducts((prevState) => {
      let newSt = { ...prevState };
      newSt.mappedProducts = productList.map(mapProducts);
      return newSt;
    });
    setPartners((prevState) => {
      let newSt = { ...prevState };
      newSt.mappedPartners = partnerList.map(mapPartners);
      return newSt;
    });
  };

  const onLookupError = (err) => {
    _logger(err);
    Toastify({
      text: "Looks like we ran into an error! Please try again.",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  };

  const mapProducts = (aProduct) => {
    return (
      <option key={aProduct.id} value={aProduct.id}>
        {aProduct.name}
      </option>
    );
  };

  const mapPartners = (aPartner) => {
    return (
      <option key={aPartner.id} value={aPartner.id}>
        {aPartner.name}
      </option>
    );
  };
  const handleSubmit = (values, { resetForm }) => {
    _logger("Submit button firing", values);
    recommendationsService
      .AddRecommendation(values)
      .then((response) => onAddRecommendationSuccess(response, resetForm))
      .catch(onAddRecommendationError);
  };
  const onAddRecommendationSuccess = (response, resetForm) => {
    _logger("AddRecommendationSuccesful", response);
    Toastify({
      text: "Recommendation has been submitted",
      backgroundColor: "green",
      duration: 3000,
    }).showToast();
    resetForm();

    navigateToViewRecommendations();
  };

  const onAddRecommendationError = (err) => {
    _logger(err);
    Toastify({
      text: "Looks like we ran into an error! Please try again.",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  };

  return (
    <Container className="container d-flex justify-content-center mt-5 text-white">
      <div className="bg-1000 border card w-75">
        <div className="col mt-2">
          <h1 className="mt-2 text-center text-white">New Recommendation</h1>
          <Formik
            enableReinitialize={true}
            initialValues={newRecommState.formData}
            onSubmit={handleSubmit}
            validationSchema={newRecommendationFormSchema}
          >
            <Col className="d-flex justify-content-center">
              <FormikForm>
                <Row className="g-2 mb-3">
                  <Form.Group>
                    <Form.Label htmlFor="partnerId">Partner Name</Form.Label>
                    <Field name="partnerId" as="select" className="form-select">
                      <option name="partnerId" className="text-muted">
                        Partner name
                      </option>
                      {partners.mappedPartners}
                    </Field>
                    <ErrorMessage
                      name="partnerId"
                      component="div"
                      className="has-error"
                    />
                  </Form.Group>
                </Row>
                <Row className="g-2 mb-3">
                  <Form.Group>
                    <Form.Label>Select Ordered Product</Form.Label>
                    <Field
                      name="sourceProductId"
                      as="select"
                      className="form-select"
                    >
                      <option name="sourceProductId" className="text-muted">
                        Product Name
                      </option>
                      {products.mappedProducts}
                    </Field>
                    <ErrorMessage
                      name="sourceProductId"
                      component="div"
                      className="has-error"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Select Upsell Product</Form.Label>
                    <Field
                      name="targetProductId"
                      as="select"
                      className="form-select"
                    >
                      <option name="targetProductId" className="text-muted">
                        Product Name
                      </option>
                      {products.mappedProducts}
                    </Field>
                    <ErrorMessage
                      name="targetProductId"
                      component="div"
                      className="has-error"
                    />
                  </Form.Group>
                </Row>
                <Row className="g-2 mb-3">
                  <Form.Group>
                    <Form.Label htmlFor="reason">Reason</Form.Label>
                    <Field
                      type="text-area"
                      name="reason"
                      className="form-control style-textarea"
                    />
                    <ErrorMessage
                      name="reason"
                      component="div"
                      className="has-error"
                    />
                  </Form.Group>
                </Row>
                <div className="container d-flex justify-content-center mt-5 text-white">
                  <Button
                    type="submit"
                    className="w-20 mb-3 mr-5 m-auto"
                    variant="outline-light"
                  >
                    Submit
                  </Button>
                  <Button
                    as={Link}
                    variant="outline-light"
                    className="w-20 mb-3 ml-5 m-auto"
                    to="/recommendations/view"
                  >
                    View recommendations
                  </Button>
                </div>
              </FormikForm>
            </Col>
          </Formik>
        </div>
      </div>
    </Container>
  );
}

NewRecommendation.PropTypes = {
  formData: PropTypes.shape({
    PartnerId: PropTypes.number.isRequired,

    reason: PropTypes.string.isRequired,
  }),
};

export default NewRecommendation;
