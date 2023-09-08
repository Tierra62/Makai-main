import React from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { twoFactorSchema } from "schemas/twoFactorSchema";

const TwoFactor = ({ submitForm, resendCode, userPhone, closeModal }) => {
  const formData = {
    code: "",
  };
  return (
    <div className="container">
      <div className="modal-header d-flex flex-column justify-content-center">
        <h2 className="modal-title">Verification Code</h2>
        <h5 className="modal-title">
          <center>
            We have sent a verification code to the mobile phone number
            associated to this account. An SMS has been sent to:
          </center>
        </h5>
        <h3>
          <center>{"+1******" + userPhone.substring(6)}</center>
        </h3>
      </div>
      <Formik
        enableReintialize={true}
        initialValues={formData}
        onSubmit={submitForm}
        validationSchema={twoFactorSchema}
      >
        <Form>
          <div className="modal-body">
            <div className="input-group mb-3">
              <Field
                component="input"
                className="form-control"
                id="code"
                name="code"
                placeholder="Your 6 digit verification code"
                aria-label="Your 6 digit verification code"
                aria-describedby="button-addon2"
              ></Field>
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                onClick={resendCode}
              >
                Resend Code
              </button>
              <ErrorMessage
                name="code"
                component="div"
                className="w-100 mt-1 fs--1 text-danger"
              />
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal-dialogue"
              onClick={closeModal}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Verify
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

TwoFactor.propTypes = {
  submitForm: PropTypes.func.isRequired,
  resendCode: PropTypes.func.isRequired,
  userPhone: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default TwoFactor;
