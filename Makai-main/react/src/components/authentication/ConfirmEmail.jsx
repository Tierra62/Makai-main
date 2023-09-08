import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Col, Row, Button } from "react-bootstrap";
import Section from "components/common/Section";
import sabioDebug from "sabio-debug";
import userService from "services/userService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import swal from "sweetalert";

const _logger = sabioDebug.extend("user");

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const [emailConfirmed, setEmailConfirmed] = useState(true);

  useEffect(() => {
    userService
      .confirmEmail(token, email)
      .then(onConfirmEmailSuccess)
      .catch(onConfirmEmailErorr);
  }, []);

  const onConfirmEmailSuccess = (response) => {
    _logger(response);

    Toastify({
      text: "Your email has been confirmed.",
      className: "success",
      style: {
        background: "blue",
      },
      duration: 2000,
    }).showToast();

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const onConfirmEmailErorr = (error) => {
    _logger(error);

    setEmailConfirmed(() => {
      return false;
    });

    swal({
      title: "Something went wrong.",
      icon: "error",
    });
  };

  const onLoginClicked = () => {
    navigate("/login");
  };

  return (
    <Section className="py-0">
      <Row className="flex-center min-vh-75 py-6">
        <Col sm={10} md={8} lg={6} xl={5} className="col-xxl-4">
          <Card>
            <Card.Body className="p-4 p-sm-5 text-center">
              {(emailConfirmed && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              )) ||
                (!emailConfirmed && (
                  <React.Fragment>
                    <h5 className="fw-semi-bold">
                      Click button if you are not redirected.
                    </h5>
                    <Button
                      type="submit"
                      color="primary"
                      className="mt-3 w-25 fw-semi-bold"
                      onClick={onLoginClicked}
                    >
                      Login
                    </Button>
                  </React.Fragment>
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Section>
  );
};

export default ConfirmEmail;
