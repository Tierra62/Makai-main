import React from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import debug from "sabio-debug";
import { Col, Row, Form as Bform } from "react-bootstrap";
import { contactSchema } from "../../schemas/contactSchema";
import contactFormServices from "services/contactformservice/contactFormServices";
import "./contactusform.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const _logger = debug.extend("UserContact");

function ContactUs() {
  const user = {
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  };

  _logger("PREFIX:", process.env.REACT_APP_API_HOST_PREFIX);

  const handleSubmit = (values) => {
    _logger("handleSubmit", values);
    contactFormServices
      .sendMessage(values)
      .then(onSendMessageSuccess)
      .catch(onSendMessageError);
  };

  function onSendMessageSuccess(response) {
    _logger("Success", response);
    Toastify({
      text: "Message was delivered",
      className: "Success",
      style: {
        background: "linear-gradient(to right, crimson)",
      },
    }).showToast();
  }
  function onSendMessageError(error) {
    _logger("Error", error);
    Toastify({
      text: "Message was not delivered",
      className: "error",
      style: {
        background: "linear-gradient(to right, crimson)",
      },
    }).showToast();
  }

  return (
    <React.Fragment>
      <div className="container contact-container-top mt-7 text-white">
        <h5 className="question-header text-center fw-bold fs-5 mb-6 text-white">
          Got a Question?
        </h5>
        <div className="row contact-row-top text-center">
          <div className="col contact-col">
            <p>Address</p>
            <span>Culver City, 400 Corporate Pointe Walk, 90230, CA</span>
          </div>
          <div className="col contact-col">
            <p>Email</p>
            <span>support@youremail.com</span>
          </div>
          <div className="col contact-col">
            <p>Phone Number</p>
            <span>+1(424) 535-3523</span>
          </div>
          <div className="col contact-col">
            <p>Contact</p>
            <span>John Doe</span>
          </div>
        </div>
      </div>
      <div className="container contact-container-bot d-flex flex-column mt-7 text-white">
        <h4
          className="contact-header top-0 start-100 fw-bold align-self-center fs-5 text-white
        "
        >
          Contact Us
        </h4>
        <p id="quote" className="text-center">
          For more Information or if you would like to say Hello!
        </p>
        <div className="col contact-col-bot">
          <Formik
            enableReinitialize={true}
            initialValues={user}
            onSubmit={handleSubmit}
            validationSchema={contactSchema}
          >
            <Form>
              <div className="row contact-row-bot">
                <Row className="align-items-center g-3 mb-4">
                  <Col xs={6}>
                    <Bform.Group>
                      <Bform.Label htmlFor="firstName" visuallyHidden>
                        First name
                      </Bform.Label>
                      <Field
                        className="Bform.Control rounded p-3 w-100 "
                        id="firstName"
                        placeholder="First Name"
                        type="text"
                        name="firstName"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="Bform.Group"
                        className="has-error"
                      />
                    </Bform.Group>
                  </Col>
                  <Col xs={6}>
                    <Bform.Group>
                      <Bform.Label htmlFor="lastName" visuallyHidden>
                        Last Name
                      </Bform.Label>
                      <Field
                        className="Bform.Control rounded p-3 w-100 "
                        id="lastName"
                        placeholder="Last Name"
                        type="text"
                        name="lastName"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="Bform.Group"
                        className="has-error"
                      />
                    </Bform.Group>
                  </Col>
                  <Col xs={12}>
                    <Bform.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Field
                        className="Bform.Control rounded p-3 w-100 "
                        type="email"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="Bform.Group"
                        className="has-error"
                      />
                    </Bform.Group>
                  </Col>
                  <Col xs={12}>
                    <Bform.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Field
                        className="Bform.Control rounded p-3 w-100 "
                        as="textarea"
                        rows={6}
                        placeholder="Leave us a Message!"
                        type="text"
                        id="message"
                        name="message"
                      />
                      <ErrorMessage
                        name="message"
                        component="Bform.Group"
                        className="has-error"
                      />
                    </Bform.Group>
                  </Col>
                </Row>
                <button
                  type="submit"
                  className="btn btn-secondary mb-6 w-25 align-self-center "
                >
                  Send Message
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ContactUs;
