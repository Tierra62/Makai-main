import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Section from "components/common/Section";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { emergencyContactSchema } from "../../schemas/emergencyContactSchema.js";
import debug from "sabio-debug";
import "./emergencycontactform.css";
import emergencyContactService from "../../services/emergencyContactService.js";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PropTypes from "prop-types";

const _logger = debug.extend("Emergency");

function EmergencyContactForm(props) {
  const [contactFormData, setContactFormData] = useState({
    name: "",
    phoneNumber: "",
    id: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setContactFormData((prevState) => {
      const pd = { ...prevState };
      if (location.state?.type === "EMERGENCY_CONTACTS_UPDATE") {
        pd.name = location.state?.name;
        pd.phoneNumber = location.state?.phoneNumber;
        pd.id = location.state?.id;
      }

      return pd;
    });
  }, []);

  // #region handleSubmit
  const submitContacts = (values, { resetForm }) => {
    _logger(values, resetForm);

    if (!values.id) {
      emergencyContactService
        .create(values)
        .then((response) => onCreateSuccess(response, resetForm))
        .catch(onCreateError);
    } else {
      emergencyContactService
        .update(values.id, values)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    }
  };

  const onCreateSuccess = (response, resetForm) => {
    _logger(response, "onCreateSuccess");
    toast.success("Contact Added");
    resetForm();
  };

  const onCreateError = (error) => {
    _logger(error, "OnCreateError");
    toast.error("Add Failed");
  };

  const onUpdateSuccess = (response) => {
    _logger(response, "onUpdateSuccess");
    swal("Successful", "Contact updated!", "success");
    onPrevious();
  };

  const onUpdateError = (error) => {
    _logger(error, "onUpdateError");
  };

  // #endregion

  const onPrevious = () => {
    navigate(`/emergency/contacts/${props.currentUser.id}`);
  };

  return (
    <React.Fragment>
      <Section>
        <div className="container mb-6 mt-8">
          <div className="row">
            <div className="col-sm-4 card m-auto">
              <h2 className="mt-3 text-center">Emergency Contacts</h2>
              <div className="card-body">
                <Formik
                  enableReinitialize={true}
                  initialValues={contactFormData}
                  validationSchema={emergencyContactSchema}
                  onSubmit={submitContacts}
                >
                  <Form>
                    <div className="mb-3 form-group" id="formGroupName">
                      <label htmlFor="name">Name</label>
                      <Field type="text" name="name" className="form-control" />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="form-field-error"
                      />
                    </div>

                    <div className="mb-3 form-group" id="formGroupPhoneNumber">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <Field
                        type="text"
                        name="phoneNumber"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="form-field-error"
                      />
                    </div>

                    <div className="mb-3 form-group d-none" id="formGroupid">
                      <label htmlFor="id">SecretId</label>
                      <Field type="text" name="id" className="form-control" />
                      <ErrorMessage
                        name="id"
                        component="div"
                        className="form-field-error"
                      />
                    </div>
                    <button
                      type="button"
                      className="mb-2 m-1 btn btn-danger"
                      onClick={onPrevious}
                    >
                      Back
                    </button>

                    <button type="submit" className="mb-2 m-1 btn btn-primary">
                      Submit
                    </button>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </Section>
    </React.Fragment>
  );
}

EmergencyContactForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default EmergencyContactForm;
