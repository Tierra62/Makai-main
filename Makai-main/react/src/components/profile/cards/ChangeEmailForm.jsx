import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { emailSchemaV2 as emailSchema } from "schemas/emailSchemaV2";
import { Row, Button } from "react-bootstrap";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import sabioDebug from "sabio-debug";
import PropTypes from "prop-types";
import userService from "services/userService";
import toastr from "toastr";

const _logger = sabioDebug.extend("profile");

const defaultFormData = {
  newEmail: "",
  currentPassword: "",
  prevEmail: "",
};

const defaultShowPassword = "password";

function ChangeEmailForm({ currentUser, handleEmailChange }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [showPassword, setShowPassword] = useState(defaultShowPassword);

  useEffect(() => {
    setFormData({
      ...defaultFormData,
      prevEmail: currentUser.email,
    });
  }, [currentUser.email]);

  const onSubmitClicked = (values) => {
    _logger("values", values);
    const payload = {
      email: values.newEmail,
      currentPassword: values.currentPassword,
    };
    userService
      .onUpdateEmail(payload)
      .then(onUpdateEmailSuccess)
      .catch(onUpdateEmailError);
  };

  const onUpdateEmailSuccess = ({ payload }) => {
    setFormData(defaultFormData);
    toastr.success("Email Address Successfully Changed");
    handleEmailChange(payload.email);
  };

  const onUpdateEmailError = (err) => {
    setFormData(defaultFormData);
    _logger("err", { err });
    if (
      err?.response?.data?.errors[0] ===
        "Current Password is incorrect. Please enter another password to try again." &&
      err?.response?.data?.errors?.length === 1
    ) {
      toastr.error("Current Password entry is incorrect. Please try again.");
    } else if (
      err?.response?.data?.errors[0] ===
        "Email is already in use. Please try again." &&
      err?.response?.data?.errors?.length === 1
    ) {
      toastr.error("Email is already in use. Please try again.");
    } else {
      toastr.error("Error Changing Email Address. Please try again.");
    }
  };

  const handleEyeClicked = (e) => {
    let type = e.currentTarget.value;
    setShowPassword(type);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formData}
      validationSchema={emailSchema}
      onSubmit={onSubmitClicked}
    >
      <Form>
        <div className="profile-card-subheader">Change Email</div>
        <div className="profile-card-subtitle pt-2 pb-1">
          Your current email address is {formData.prevEmail}
        </div>
        <div className="pb-3">
          <div className="d-flex">
            <div className="form-group">
              <div
                htmlFor="currentPassword"
                className="form-label font-weight-bold"
              >
                Current Password
              </div>
              <Field
                name="currentPassword"
                type={showPassword}
                className="form-control"
                autoComplete="current-password"
              />
            </div>
            <div className="password-icon">
              {showPassword === "password" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  value="text"
                >
                  <FaEye />
                </button>
              )}
              {showPassword === "text" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  value="password"
                >
                  <FaEyeSlash />
                </button>
              )}
            </div>
          </div>
          <ErrorMessage
            name="currentPassword"
            component="div"
            className="has-error text-danger"
          />
        </div>
        <div className="pb-3">
          <div className="d-flex">
            <div className="form-group">
              <div htmlFor="newEmail" className="form-label font-weight-bold">
                New Email
              </div>
              <Field
                name="newEmail"
                type="text"
                className="form-control"
                autoComplete="email"
              />
            </div>
          </div>
          <ErrorMessage name="newEmail" component="div" className="has-error" />
        </div>
        <Row>
          <div className="form-group">
            <Button name="submit" type="submit">
              Update Email
            </Button>
          </div>
        </Row>
      </Form>
    </Formik>
  );
}

ChangeEmailForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  handleEmailChange: PropTypes.func.isRequired,
};

export default ChangeEmailForm;
