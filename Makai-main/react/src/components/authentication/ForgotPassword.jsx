import React from "react";
import { useNavigate } from "react-router-dom";
import AuthCardLayout from "layouts/AuthCardLayout";
import { Container, Form, Button } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import sabioDebug from "sabio-debug";
import { emailSchema } from "schemas/emailSchema";
import userService from "services/userService";
import swal from "sweetalert";

const _logger = sabioDebug.extend("reset");

const ForgotPassword = () => {
  const navigate = useNavigate();
  const formData = {
    email: "",
  };

  const onSubmitClicked = (values) => {
    userService
      .forgotPassword(values.email)
      .then(onForgotPasswordSuccess)
      .catch(onForgotPasswordError);
  };

  const onForgotPasswordSuccess = (response) => {
    _logger(response);

    swal({
      title: "A reset password link as been sent.",
      icon: "success",
    });

    navigate("/");
  };

  const onForgotPasswordError = (error) => {
    _logger(error);

    swal("Email not found", "Please try again", "error");
  };

  return (
    <div className="fluid-container">
      <AuthCardLayout>
        <Container>
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            validationSchema={emailSchema}
            onSubmit={onSubmitClicked}
          >
            <FormikForm>
              <Form.Group>
                <h4>Forgot your password?</h4>
                <p>Enter your email and we&apos;ll send you a reset link.</p>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="form-control mt-4"
                ></Field>
                <ErrorMessage
                  name="email"
                  type="text"
                  className="has-error"
                ></ErrorMessage>
              </Form.Group>
              <Form.Group>
                <Button type="submit" className="w-100 mt-3">
                  Send reset link
                </Button>
              </Form.Group>
            </FormikForm>
          </Formik>
        </Container>
      </AuthCardLayout>
    </div>
  );
};

export default ForgotPassword;
