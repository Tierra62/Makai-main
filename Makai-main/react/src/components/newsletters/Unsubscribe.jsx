import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import Section from "components/common/Section";
import { Field, Form, Formik } from "formik";
import newsletterSubscriptionService from "../../services/newsletterSubscriptionService";
import sabioDebug from "sabio-debug";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastr from "toastr";
import "./newsletterstyle.css";

const _logger = sabioDebug.extend("NewsletterSub");

function NewsletterSubscription() {
  const formData = {
    email: "",
  };

  const onUnsubscribeClick = (values) => {
    newsletterSubscriptionService
      .unsubscribe(values)
      .then(onunsubscribeSuccess)
      .catch(onunsubscribeError);
  };

  const onunsubscribeSuccess = (response) => {
    toast.success("Subscribed", {
      position: toast.POSITION.TOP_RIGHT,
    });
    _logger("onSubscribe", response);
  };

  const onunsubscribeError = (error) => {
    _logger("subscribe error", error.response);
    toastr.error("could not subscribe email, please try again.");
  };

  return (
    <Section className="text-center text-secondary landing-bg-ocean-light">
      <Container className="unsubcribe-container">
        Unsubscribe From Our Newsletter
        <Row className="justify-content-center text-center">
          <Col xs={3} sm="auto" className>
            <Formik initialValues={formData} onSubmit={onUnsubscribeClick}>
              <Form>
                <div className="form-group input-group bg-white shadow-sm">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="form-control height-inherit pl-4"
                    id="newletterEmail"
                  ></Field>
                  <div
                    className="spinner-border d-none mt-3"
                    role="status"
                  ></div>
                  <span className="sr-only"></span>
                </div>
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="border-2 rounded-pill mt-4 fs-0 py-2"
                  type="submit"
                >
                  Unsubscribe
                </Button>
                <ToastContainer />
              </Form>
            </Formik>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default NewsletterSubscription;
