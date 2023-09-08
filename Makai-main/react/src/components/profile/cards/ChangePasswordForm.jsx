import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Row } from "react-bootstrap";
import { passwordSchemaV2 } from "schemas/passwordSchemaV2";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import sabioDebug from "sabio-debug";
import userService from "../../../services/userService";
import toastr from "toastr";
import PropTypes from "prop-types";

const _logger = sabioDebug.extend("profile");

const defaultFormData = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
  email: "",
};

const defaultShowPassword = {
  currentPassword: "password",
  newPassword: "password",
  confirmPassword: "password",
};

const ChangePasswordForm = ({ currentUser }) => {
  const [formData, setFormData] = useState(defaultFormData);

  const [showPassword, setShowPassword] = useState(defaultShowPassword);

  useEffect(() => {
    setFormData({
      ...defaultFormData,
      email: currentUser.email,
    });
  }, [currentUser.email]);

  const onSubmitClicked = (values) => {
    userService
      .changePasswordV2(values)
      .then(onChangePasswordSuccess)
      .catch(onChangePasswordError);
  };

  const onChangePasswordSuccess = () => {
    setFormData(defaultFormData);
    toastr.success("Password Successfully Changed!");
  };

  const onChangePasswordError = (err) => {
    setFormData(defaultFormData);
    _logger("err", { err });
    if (
      err?.response?.data?.errors[0] ===
        "Current Password is incorrect. Please enter another password to try again." &&
      err?.response?.data?.errors?.length === 1
    ) {
      toastr.error("Current Password entry is incorrect. Please try again.");
    } else {
      toastr.error("Error Changing Password. Please try again.");
    }
  };

  const handleEyeClicked = (e) => {
    let targetProperty = e.currentTarget.name;
    let newValue = e.currentTarget.value;
    setShowPassword((prevState) => {
      let pd = { ...prevState };
      pd[targetProperty] = newValue;
      return pd;
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formData}
      validationSchema={passwordSchemaV2}
      onSubmit={onSubmitClicked}
    >
      <Form className="me-11">
        <div className="profile-card-subheader card-text">Change Password</div>
        <div className="card-text profile-card-subtitle pb-1 pt-2">
          We will email you a confirmation when changing your password, so
          please expect that email after submitting.
        </div>
        <div className="pb-3">
          <div className="d-flex">
            <div className="form-group input-text">
              <div
                htmlFor="currentPassword"
                className="form-label font-weight-bold"
              >
                Current Password
              </div>
              <Field
                name="currentPassword"
                type={showPassword.currentPassword}
                className="form-control"
                autoComplete="current-password"
              />
            </div>
            <div className="password-icon">
              {showPassword.currentPassword === "password" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  name="currentPassword"
                  value="text"
                >
                  <FaEye />
                </button>
              )}
              {showPassword.currentPassword === "text" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  name="currentPassword"
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
              <div htmlFor="password" className="form-label font-weight-bold">
                New Password
              </div>
              <Field
                name="password"
                type={showPassword.newPassword}
                className="form-control"
                autoComplete="new-password"
              />
            </div>
            <div className="password-icon">
              {showPassword.newPassword === "password" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  name="newPassword"
                  value="text"
                >
                  <FaEye />
                </button>
              )}
              {showPassword.newPassword === "text" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  name="newPassword"
                  value="password"
                >
                  <FaEyeSlash />
                </button>
              )}
            </div>
          </div>
          <ErrorMessage
            name="password"
            component="div"
            className="has-error text-danger"
          />
        </div>
        <div className="pb-3">
          <div className="d-flex">
            <div className="form-group">
              <div
                htmlFor="confirmPassword"
                className="font-weight-bold form-label"
              >
                Confirm New Password
              </div>
              <Field
                name="confirmPassword"
                type={showPassword.confirmPassword}
                className="form-control"
                autoComplete="new-password"
              ></Field>
            </div>
            <div className="password-icon">
              {showPassword.confirmPassword === "password" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  name="confirmPassword"
                  value="text"
                >
                  <FaEye />
                </button>
              )}
              {showPassword.confirmPassword === "text" && (
                <button
                  type="button"
                  className="btn shadow-none p-0"
                  onClick={handleEyeClicked}
                  name="confirmPassword"
                  value="password"
                >
                  <FaEyeSlash />
                </button>
              )}
            </div>
          </div>
          <ErrorMessage
            name="confirmPassword"
            component="div"
            className="has-error text-danger"
          />
        </div>
        <Row className="g-3">
          <div className="form-group pb-3">
            <Button type="submit">Update Password</Button>
          </div>
        </Row>
      </Form>
    </Formik>
  );
};
ChangePasswordForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChangePasswordForm;
