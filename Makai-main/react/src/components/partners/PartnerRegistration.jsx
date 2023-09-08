import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Col, Container, Row, Image } from "react-bootstrap";
import debug from "sabio-debug";
import { partnerRegSchema } from "schemas/partnerRegSchema";
import swal from "sweetalert";
import * as partnerService from "services/partnerService";
import PartnerAuthLayout from "./PartnerAuthLayout";
import * as fileService from "../../services/fileService";

const _logger = debug.extend("partners");

const PartnerRegistration = ({ currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    businessPhone: "",
    siteUrl: "",
    isLoggedIn: false,
    roles: currentUser.roles,
    createdBy: currentUser.id,
    showRegister: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      navigate("/login", {
        state: { type: "LOGINPARTNER", fromPartnerReg: true },
      });
    } else {
      if (currentUser.roles.includes("Partner")) {
        setFormData((prevState) => {
          const formData = { ...prevState };
          formData.showRegister = true;
          return formData;
        });
      } else {
        setFormData((prevState) => {
          const formData = { ...prevState };
          formData.showRegister = true;
          return formData;
        });
      }
    }
  }, [currentUser]);

  _logger("PartnerInfo location:", location);

  const onRegisterClicked = (payload) => {
    _logger("register clicked =>", payload);

    partnerService
      .registerPartner(payload)
      .then(onRegisterPartnerSuccess)
      .catch(onRegisterPartnerError);
  };

  const onRegisterPartnerSuccess = (response) => {
    _logger(response);

    swal({
      title: "Registration successful!",
      icon: "success",
    });

    navigate("/stripe/partner");
  };

  const onRegisterPartnerError = (error) => {
    _logger(error);

    swal("Registration unsuccessful", "Please try again.", "error");
  };

  function handleUpload(e, setValue) {
    e.preventDefault();
    _logger("CHANGE_EVENT", e.target.files);
    const file = e.target.files[0];
    _logger("uploaded file ->", file);
    const payload = new FormData();

    setUploadedFiles([]);
    for (let i = 0; i < e.target.files.length; i++) {
      payload.append("files", e.target.files[i]);
    }

    fileService
      .uploadFiles(payload)
      .then((res) => onUploadSuccess(res, setValue))
      .catch(onUploadError);
  }

  const onUploadSuccess = (response, setFieldValue) => {
    if (response?.items) {
      setFieldValue("logo", response?.items[0]?.url);
    }
  };

  const onUploadError = (error) => {
    _logger(error);

    swal("Upload unsuccessful", "Please try again.", "error");
  };

  return (
    <Container className="p-4 m-4">
      {formData.showRegister && (
        <Row className="justify-content-center p-4">
          <Col>
            <Formik
              enableReinitialize={true}
              initialValues={formData}
              validationSchema={partnerRegSchema}
              onSubmit={onRegisterClicked}
            >
              {({ setFieldValue }) => (
                <Col>
                  <FormikForm>
                    <PartnerAuthLayout
                      bgProps={{
                        image: "../../../assets/img/illustrations/beach.jpg",
                      }}
                    >
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="name">
                            Name of Business
                          </Form.Label>
                          <Field
                            name="name"
                            type="text"
                            className="form-control"
                          ></Field>
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="has-error"
                          ></ErrorMessage>
                        </Form.Group>
                      </Col>
                      <Col style={{ width: "285px", height: "75" }}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            htmlFor="logo"
                            className="form-check-label"
                          >
                            Upload Your Business Logo
                          </Form.Label>
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control uploader-input"
                              name="logo"
                              id="file"
                              onChange={(e) => handleUpload(e, setFieldValue)}
                            />
                          </div>
                          <ErrorMessage
                            name="logo"
                            component="div"
                            className="has-error"
                          ></ErrorMessage>
                        </Form.Group>
                        <div className="d-flex flex-wrap">
                          {uploadedFiles.length
                            ? uploadedFiles.map((fileData, index) => (
                              <Image
                                key={index}
                                src={fileData}
                                alt="Uploaded-Img"
                                className="mr-2 img-fluid img-thumbnail uploaded-img"
                              />
                            ))
                            : null}
                        </div>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="businessPhone">
                            Business Phone Number
                          </Form.Label>
                          <Field
                            name="businessPhone"
                            type="text"
                            className="form-control"
                          ></Field>
                          <ErrorMessage
                            name="businessPhone"
                            component="div"
                            className="has-error"
                          ></ErrorMessage>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="siteUrl">Website Url</Form.Label>
                          <Field
                            name="siteUrl"
                            type="text"
                            className="form-control"
                          ></Field>
                          <ErrorMessage
                            name="siteUrl"
                            component="div"
                            className="has-error"
                          ></ErrorMessage>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="d-flex justify-content-center">
                          <Button className="w-50" type="submit">
                            Register
                          </Button>
                        </Form.Group>
                      </Col>
                    </PartnerAuthLayout>
                  </FormikForm>
                </Col>
              )}
            </Formik>
          </Col>
        </Row>
      )}
    </Container>
  );
};

PartnerRegistration.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    email: PropTypes.string,
    isLoggedIn: PropTypes.bool,
  }).isRequired,
};

export default PartnerRegistration;
