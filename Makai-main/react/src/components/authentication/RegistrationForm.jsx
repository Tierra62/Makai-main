import React, { useState, useEffect } from "react";
import userService from "services/userService";
import lookUpService from "services/lookUpService";
import { Link } from "react-router-dom";
import { Button, Form, Row, Col, Container, Modal } from "react-bootstrap";
import Divider from "components/common/Divider";
import SocialAuthButtons from "../common/misc/SocialAuthButtons";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import swal from "sweetalert";
import { registrationSchema } from "schemas/registrationSchema";
import sabioDebug from "sabio-debug";
import SiteReference from "components/sitereference/SiteReference";

const _logger = sabioDebug.extend("registration");

const RegistrationForm = () => {
  const formData = {
    firstName: "",
    lastName: "",
    mi: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    roleId: 0,
  };

  const [userRoles, setUserRoles] = useState([]);
  const [userId, setUserId] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    lookUpService.LookUp(["Roles"]).then(onLookUpSuccess).catch(onLookUpError);
  }, []);

  const onLookUpSuccess = (response) => {
    const rolesArr = response.item.roles;

    setUserRoles(() => {
      return rolesArr.map(mapRoles);
    });
  };

  const onLookUpError = (error) => {
    _logger(error);
  };

  const onRegisterClicked = (values) => {
    userService
      .registerUser(values)
      .then(onRegisterUserSuccess)
      .catch(onRegisterUserError);
  };

  const onRegisterUserSuccess = (response) => {
    const newUserId = response.item;

    setUserId(() => {
      return newUserId;
    }, setShowModal(true));
  };

  const onRegisterUserError = (error) => {
    _logger(error);

    swal("Registration unsuccessful", "Please try again.", "error");
  };

  const mapRoles = (role) => {
    _logger(role);

    if (role.name !== "Admin") {
      return (
        <option key={role.id} value={Number(role.id)}>
          {role.name}
        </option>
      );
    }
  };

  return (
    <Container className="p-0">
      <Formik
        enableReinitialize={true}
        initialValues={formData}
        validationSchema={registrationSchema}
        onSubmit={onRegisterClicked}
      >
        <FormikForm>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <Field
              name="firstName"
              type="text"
              className="form-control"
            ></Field>
            <ErrorMessage
              name="firstName"
              component="div"
              className="has-error"
            ></ErrorMessage>
          </Form.Group>
          <Row className="g-2 mb-3">
            <Form.Group className="mb-3" as={Col} sm={10}>
              <Form.Label htmlFor="lastName"> Last Name</Form.Label>
              <Field
                name="lastName"
                type="text"
                className="form-control"
              ></Field>
              <ErrorMessage
                name="lastName"
                component="div"
                className="has-error"
              ></ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3" as={Col} sm={2}>
              <Form.Label htmlFor="mi">M.I.</Form.Label>
              <Field name="mi" type="text" className="form-control"></Field>
              <ErrorMessage
                name="mi"
                component="div"
                className="has-error"
              ></ErrorMessage>
            </Form.Group>
          </Row>
          <Row className="g-2 mb-3">
            <Form.Group className="mb-3" as={Col} sm={6}>
              <Form.Label htmlFor="dob">Date of Birth</Form.Label>
              <Field name="dob" type="date" className="form-control"></Field>
              <ErrorMessage
                name="dob"
                component="div"
                className="has-error"
              ></ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3" as={Col} sm={6}>
              <Form.Label>Role</Form.Label>
              <Field name="roleId" as="select" className="form-select">
                <option value="" className="text-muted">
                  Select Role
                </option>
                {userRoles}
              </Field>
              <ErrorMessage
                name="roleId"
                component="div"
                className="text-danger ms-2"
              ></ErrorMessage>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email"> Email Address </Form.Label>
            <Field name="email" type="email" className="form-control"></Field>
            <ErrorMessage
              name="email"
              component="div"
              className="has-error"
            ></ErrorMessage>
          </Form.Group>
          <Row className="g-2 mb-3">
            <Form.Group as={Col} sm={6}>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Field
                name="password"
                type="password"
                className="form-control"
              ></Field>
              <ErrorMessage
                name="password"
                component="div"
                className="has-error"
              ></ErrorMessage>
            </Form.Group>
            <Form.Group as={Col} sm={6}>
              <Form.Label htmlFor="confirmPassword">
                Confirm Password
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
              ></ErrorMessage>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="phone">Phone</Form.Label>
            <div className="input-group mb-3">
              <span className="input-group-text">+1</span>
              <Field name="phone" type="text" className="form-control"></Field>
            </div>
            <ErrorMessage
              name="phone"
              component="div"
              className="has-error"
            ></ErrorMessage>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="acceptCheckbox"
              className="form-check"
            >
              <Form.Check.Input type="checkbox" name="isAccepted" />
              <Form.Check.Label className="form-label">
                I accept the <Link to="#!">terms</Link> and{" "}
                <Link to="#!">privacy policy</Link>
              </Form.Check.Label>
            </Form.Check>
          </Form.Group>
          <Form.Group className="mb-4">
            <Button className="w-100" type="submit">
              Register
            </Button>
          </Form.Group>
          <Divider>or register with</Divider>
          <SocialAuthButtons />
        </FormikForm>
      </Formik>
      <Modal show={showModal}>
        <SiteReference show={showModal} userId={userId} />
      </Modal>
    </Container>
  );
};

export default RegistrationForm;
