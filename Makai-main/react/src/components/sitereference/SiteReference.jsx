import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import debug from "sabio-debug";
import siteReferenceSchema from "../../schemas/siteReferenceSchema";
import siteReferenceService from "../../services/siteReferenceService";
import lookUpService from "services/lookUpService";
import PropTypes from "prop-types";
import "./sitereference.css";

const _logger = debug.extend("SiteReference");

function SiteReference(props) {
  const navigate = useNavigate();
  const [label, setLabel] = useState({
    labels: [],
    labelsComponents: [],
  });

  const mapLabel = (label) => {
    _logger("label", label);
    return (
      <div className="my-2" key={label.id}>
        <label className="d-block">
          <Field
            className="ms-3"
            type="radio"
            name="siteReferenceId"
            value={label.name}
          />
          <span className="ms-3">{label.name}</span>
        </label>
      </div>
    );
  };

  const submitForm = (values) => {
    _logger("SiteReference values submitForm", values.siteReferenceId);
    let findId = label.labels.find(
      (label) => label.name === values.siteReferenceId
    );
    _logger("findId", findId.id);
    let payload = {
      siteReferenceId: findId.id,
      userId: props?.userId,
    };
    _logger("payload", payload);
    siteReferenceService
      .add(payload)
      .then(onSubmitSuccess)
      .catch(onSubmitError);
  };
  const onSubmitSuccess = (response) => {
    _logger("SiteReference success", response);

    swal({
      title: "Registration successful!",
      icon: "success",
    });

    navigate("/login");
  };
  const onSubmitError = (err) => {
    _logger("SiteReference Error", err);
  };

  useEffect(() => {
    const payload = ["ReferenceTypes"];
    lookUpService.LookUp(payload).then(onLookupSuccess).catch(onLookupError);
  }, []);

  const onLookupSuccess = (response) => {
    _logger("SiteReference", response.item);

    setLabel((prevState) => {
      const pd = { ...prevState };
      pd.labels = response.item.referenceTypes;
      pd.labelsComponents = pd.labels.map(mapLabel);
      return pd;
    });
  };

  const onLookupError = (err) => {
    _logger("SiteReference", err);
  };

  return (
    <React.Fragment>
      <div className="container d-flex justify-content-center">
        <div className="row">
          <div className="col-xxl-3 p-2">
            <div className="site-reference-container card p-3 pt-3">
              <h4>How did you discover Makai?</h4>
              <Formik
                enableReintialize={true}
                initialValues={{
                  siteReferenceId: "",
                }}
                onSubmit={submitForm}
                validationSchema={siteReferenceSchema}
              >
                <Form>
                  <div>
                    <div role="group">{label.labelsComponents}</div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

SiteReference.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default SiteReference;
