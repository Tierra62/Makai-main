import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "components/common/Divider";
import { Button, Col, Form, Row, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import SocialAuthButtons from "components/common/misc/SocialAuthButtons";
import { loginSchema } from "schemas/loginSchema";
import userService from "services/userService";
import * as loyaltyPointsService from "../../services/loyaltyPointsService";
import sabioDebug from "sabio-debug";
import swal from "sweetalert";
import twoFactorAuthService from "services/twoFactorAuthService";
import TwoFactor from "../twofactor/TwoFactor";
import "./login.css";

const _logger = sabioDebug.extend("login");

const LoginForm = () => {
  const navigate = useNavigate();
  const formData = {
    email: "",
    password: "",
  };

  const [showModal, setShowModal] = useState(false);
  const [userPhone, setUserPhone] = useState("******1234");
  const [twoFactor, setTwoFactor] = useState(false);

  const onLoginClicked = (values) => {
    userService.loginUser(values).then(onLoginSuccess).catch(onLoginError);
  };

  const onLoginSuccess = (response) => {
    _logger(response);
    userService.getCurrent().then(onGetCurrentSuccess).catch(onGetCurrentError);
  };

  const onGetCurrentSuccess = (data) => {
    _logger(data, "thisisuser");
    if (data.item.roles[0] !== "Admin") {
      loyaltyPointsService.loginLog(0, 5).then((response) => {
        const loginLog = response.item.pagedItems;
        _logger(loginLog, "log list", loginLog[0].dateLoggedIn.slice(0, 10));

        const firstRecordDate = loginLog[0].dateLoggedIn;
        const formattedFirstRecordDate = firstRecordDate.slice(0, 10); // Extract only the date portion in yyyy-mm-dd format
        const today = new Date().toISOString().slice(0, 10); // Extract today's date in yyyy-mm-dd format

        if (formattedFirstRecordDate === today && loginLog.length > 1) {
          swal({
            title: "Login successful!",
            icon: "success",
          }).then(() => {
            swal({
              text: "Login Point(+10pts) has been issued for today.",
              icon: "success",
            });
          });
        } else {
          swal({
            title: "Login successful!",
            icon: "success",
          }).then(() => {
            swal({
              text: "Welcome! Registration Point(+1,000pts) and Login Point(+10pts) have been issued to you. Thank you for choosing us.",
              icon: "success",
            });
          });
        }
      });
    }

    userService
      .getById(data.item.id)
      .then(onGetDetailsSuccess)
      .catch(onGetDetailsError);
  };

  const onGetDetailsSuccess = (data) => {
    _logger(data);
    if (
      data.item.phone.length < 10 ||
      data.item.phone.length > 10 ||
      data.item.phone.includes("-") ||
      !data.item.is2FA
    ) {
      navigateUserSuccess("2FA disabled.");
    } else {
      setUserPhone(data.item.phone);
      setTwoFactor(true);
    }
  };

  useEffect(() => {
    if (twoFactor) {
      twoFactorAuthService
        .sendSMS({ mobilePhone: userPhone })
        .then(onSendSuccess)
        .catch(onSendError);
    }
  }, [twoFactor]);

  const onGetDetailsError = (error) => {
    _logger(error);
    userService.logoutUser().then(onLogoutSuccess).catch(onLogoutError);
  };

  const onGetCurrentError = (error) => {
    _logger(error);
  };

  const onSendSuccess = (data) => {
    _logger("Success: ", data);
    if (!showModal) {
      setShowModal(true);
    }
    _logger("Show Modal: ", showModal);
  };

  const onSendError = (error) => {
    _logger("Error: ", error);
    userService.logoutUser().then(onLogoutSuccess).catch(onLogoutError);
  };

  const onLoginError = (error) => {
    _logger("Error logging in", error);

    const messages = error.response.data.errors;

    const onlyError = messages.length === 1;

    if (onlyError && messages[0] === "No user exists with the given email") {
      swal(
        "Could not find any email address in our records matching the one entered",
        "Please try again",
        "warning"
      );
    } else if (
      onlyError &&
      messages[0] === "User data could not be validated"
    ) {
      swal(
        "Login unsuccessful",
        "Please confirm that the email and password combination you entered is correct",
        "error"
      );
    } else if (onlyError && messages[0] === "Email is not confirmed") {
      swal("Email is not confirmed", "Please confirm and try again", "warning");
    } else {
      swal("Something went wrong", "Please try again", "error");
    }
  };

  const onLogoutSuccess = (data) => {
    _logger("Success: ", data);
  };

  const onLogoutError = (error) => {
    _logger("Error: ", error);
  };

  const onSubmitCode = (values) => {
    _logger(values);
    _logger("Request: ", {
      mobilePhone: userPhone,
      code: values.code,
    });
    if (values.code !== "") {
      twoFactorAuthService
        .checkSMS({
          mobilePhone: userPhone,
          code: values.code,
        })
        .then(onCheckSuccess)
        .catch(onCheckError);
    }
  };

  const onCheckSuccess = (data) => {
    _logger("Success: ", data);
    if (data.item === "approved") {
      userService
        .getCurrent()
        .then(navigateUserSuccess)
        .catch(navigateUserError);
    } else {
      onCheckError(data);
    }
  };

  const navigateUserSuccess = (data) => {
    _logger("Success: ", data);
    swal({
      title: "Login successful!",
      icon: "success",
    });
    const stateForTransport = { type: "USER_LOGIN", payload: data.item };
    navigate("/", { state: stateForTransport });
  };

  const navigateUserError = (error) => {
    _logger("Error: ", error);
  };

  const onCheckError = (error) => {
    _logger("Error: ", error);
    swal("Login unsuccessful", "Please try again", "error");
  };

  const onResendCode = () => {
    twoFactorAuthService
      .sendSMS({ mobilePhone: userPhone })
      .then(onSendSuccess)
      .catch(onSendError);
  };

  const closeModal = () => {
    setShowModal(false);
    userService.logoutUser().then(onLogoutSuccess).catch(onLogoutError);
  };

  return (
    <Container>
      <Formik
        enableReinitialize={true}
        initialValues={formData}
        validationSchema={loginSchema}
        onSubmit={onLoginClicked}
      >
        <FormikForm>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email Address</Form.Label>
            <Field name="email" type="email" className="form-control"></Field>
            <div className="has-login-error">
              <ErrorMessage name="email" type="text"></ErrorMessage>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Field
              name="password"
              type="password"
              className="form-control"
            ></Field>
            <div className="has-login-error">
              <ErrorMessage name="password" type="text"></ErrorMessage>
            </div>
          </Form.Group>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              <Form.Check type="checkbox" id="rememberMe" className="mb-0">
                <Form.Check.Input type="checkbox" name="remember" />
                <Form.Check.Label className="mb-0 text-700">
                  Remember me
                </Form.Check.Label>
              </Form.Check>
            </Col>
            <Col xs="auto">
              <Link className="fs--1 mb-0" to="/forgotpassword">
                Forgot Password?
              </Link>
            </Col>
          </Row>
          <Form.Group>
            <Button type="submit" color="primary" className="mt-3 w-100">
              Log in
            </Button>
          </Form.Group>
          <Divider className="mt-4">or log in with</Divider>
          <SocialAuthButtons />
        </FormikForm>
      </Formik>
      <Modal show={showModal}>
        <TwoFactor
          submitForm={onSubmitCode}
          resendCode={onResendCode}
          userPhone={userPhone}
          closeModal={closeModal}
        ></TwoFactor>
      </Modal>
    </Container>
  );
};

export default LoginForm;
