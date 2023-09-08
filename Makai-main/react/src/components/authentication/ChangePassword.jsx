import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import AuthCardLayout from "layouts/AuthCardLayout";
import { passwordSchema } from "schemas/passwordSchema";
import swal from "sweetalert";
import sabioDebug from "sabio-debug";
import userService from "services/userService";

const _logger = sabioDebug.extend("change");

const ChangePassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const formData = {
    password: "",
    confirmPassword: "",
  };

  const onResetClicked = (values) => {
    const payload = {
      email: email,
      token: token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    userService
      .changePassword(payload)
      .then(onChangePasswordSuccess)
      .catch(onChangePasswordError);
  };

  const onChangePasswordSuccess = (response) => {
    _logger(response);

    swal({
      title: "Password reset successful",
      icon: "success",
    });

    navigate("/login");
  };

  const onChangePasswordError = (error) => {
    _logger(error);

    swal("Password reset failed", "Please try again", "error");
  };

  return (
    <div className="fluid-container">
      <AuthCardLayout>
        <Container>
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            validationSchema={passwordSchema}
            onSubmit={onResetClicked}
          >
            <FormikForm>
              <Form.Group>
                <h3>Reset password</h3>
                <Form.Label htmlFor="password" className="mt-3">
                  Password
                </Form.Label>
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                />
              </Form.Group>
              <ErrorMessage
                name="password"
                component="div"
                className="has-error"
              />
              <Form.Group>
                <Form.Label htmlFor="confirmPassword" className="mt-3">
                  Confirm password
                </Form.Label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                ></Field>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="has-error"
                />
              </Form.Group>
              <Form.Group>
                <Button type="submit" className="w-100 mt-3">
                  Set password
                </Button>
              </Form.Group>
            </FormikForm>
          </Formik>
        </Container>
      </AuthCardLayout>
    </div>
  );
};

export default ChangePassword;
