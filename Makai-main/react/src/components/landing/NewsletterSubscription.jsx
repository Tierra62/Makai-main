import SectionHeader from "./SectionHeader";
import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Section from "components/common/Section";
import { Field, Form, Formik } from "formik";
import newsletterSubscriptionService from "../../services/newsletterSubscriptionService";
import sabioDebug from "sabio-debug";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastr from "toastr";

const _logger = sabioDebug.extend("NewsletterSub");

function NewsletterSubscription() {
  const formData = {
    email: "",
  };

  const onSubscribeClick = (values) => {
    newsletterSubscriptionService
      .create(values)
      .then(onSubscribeSuccess)
      .catch(onSubscribeError);
  };

  const onSubscribeSuccess = (response) => {
    toast.success("Subscribed", {
      position: toast.POSITION.TOP_RIGHT,
    });
    _logger("onSubscribe", response);
  };

  const onSubscribeError = (error) => {
    _logger("subscribe error", error.response);
    toastr.error("could not subscribe email, please try again.");
  };

  return (
    <Section className="text-center text-secondary landing-bg-ocean-dark">
      <SectionHeader subtitle="Join Our Newsletter" />
      <Row className="justify-content-center text-center">
        <Col xs={3} sm="auto" className>
          <Formik initialValues={formData} onSubmit={onSubscribeClick}>
            <Form>
              <div className="form-group input-group bg-white shadow-sm">
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-control height-inherit pl-4"
                  id="newletterEmail"
                ></Field>
                <div className="spinner-border d-none mt-3" role="status"></div>
                <span className="sr-only"></span>
              </div>
              <Button
                variant="outline-light"
                size="sm"
                className="border-2 rounded-pill mt-4 fs-0 py-2"
                type="submit"
              >
                Subscribe
              </Button>
              <ToastContainer />
            </Form>
          </Formik>
        </Col>
      </Row>
    </Section>
  );
}

export default NewsletterSubscription;
