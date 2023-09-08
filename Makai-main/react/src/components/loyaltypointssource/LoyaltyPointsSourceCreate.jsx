import { Formik, Form, ErrorMessage, Field } from "formik";
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Card, Row } from "react-bootstrap";
import loyaltyPointSourceFormSchema from "../../schemas/loyaltyPointSourceFormSchema";
import "./loyaltyPointsSource.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import debug from "sabio-debug";
const _logger = debug.extend("LoySourceList");

const PointSourceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    pointsAwarded: "",
    dateExpire: null,
  });

  const minDateToday = new Date();

  _logger(formData);

  const { state } = useLocation();
  const { Id } = useParams();
  useEffect(() => {
    if (
      state?.type === "LoyaltyPointSource_Edit" &&
      state?.payload.id === Number(Id)
    ) {
      _logger("NAV::", state.payload);
      setFormData((prevState) => {
        const newObj = { ...prevState };
        newObj.id = state.payload.id;
        newObj.name = state.payload.name;
        newObj.pointsAwarded = state.payload.pointsAwarded;
        if (
          state.payload.dateExpire === "0001-01-01T00:00:00" ||
          !state.payload.dateExpire
        ) {
          newObj.dateExpire = "";
        } else {
          newObj.dateExpire = new Date(state.payload.dateExpire);
        }
        _logger("indicator", newObj);
        return newObj;
      });
    } else {
      formData;
    }
  }, [state]);

  const navigate = useNavigate();
  const onClickSubmitBtn = (values, { resetForm }) => {
    const payload = { ...values };

    payload.dateExpire = values.dateExpire || null;
    onSubmit(payload);
    resetForm();
    setFormData({
      id: "",
      name: "",
      pointsAwarded: "",
      dateExpire: "",
    });
    navigate("/admin/loyaltypointssource/");
  };

  const handleReset = ({ resetForm }) => {
    resetForm();
    navigate("/admin/loyaltypointssource/");
    setFormData({
      id: "",
      name: "",
      pointsAwarded: "",
      dateExpire: "",
    });
  };

  const onDateChange = (date, setFieldValue) => {
    setFieldValue("dateExpire", date);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formData}
      onSubmit={onClickSubmitBtn}
      validationSchema={loyaltyPointSourceFormSchema}
    >
      {({ resetForm, values, setFieldValue }) => (
        <Form>
          <Card>
            <Card.Header as="h5">Source Management</Card.Header>
            <Card.Body className="bg-light">
              <Row className="gx-2 gy-3 d-none">
                <div className="form-group">
                  <label htmlFor="pointSourceId" className="form-label fw-bold">
                    Point Id
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="pointSourceId"
                    name="id"
                  />
                  <ErrorMessage
                    name="id"
                    component="div"
                    className="has-error"
                  />
                </div>
              </Row>
              <Row className="gx-2 gy-3">
                <div className="form-group">
                  <label
                    htmlFor="pointSourceName"
                    className="form-label fw-bold"
                  >
                    Point Name
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="pointSourceName"
                    name="name"
                    placeholder="$25 OFF"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="has-error"
                  />
                </div>
              </Row>
              <Row className="gx-2 gy-3">
                <div className="form-group">
                  <label
                    htmlFor="pointSourceValue"
                    className="form-label fw-bold"
                  >
                    Point Value
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="pointSourceValue"
                    name="pointsAwarded"
                    placeholder="-2500"
                  />
                  <ErrorMessage
                    name="pointsAwarded"
                    component="div"
                    className="has-error"
                  />
                </div>
              </Row>
              <Row className="gx-2 gy-3">
                <div className="form-group">
                  <label
                    htmlFor="pointSourceExpiration"
                    className="form-label fw-bold"
                  >
                    Expiration Date
                  </label>
                  <DatePicker
                    name="dateExpire"
                    id="pointSourceExpiration"
                    wrapper
                    className="form-control"
                    showIcon
                    dateFormat="yyyy-MM-dd"
                    placeholderText="YYYY-MM-DD"
                    minDate={minDateToday}
                    selected={values.dateExpire}
                    onChange={(date) => onDateChange(date, setFieldValue)}
                  />
                  <ErrorMessage
                    name="dateExpire"
                    component="div"
                    className="has-error"
                  />
                </div>
              </Row>
              <div className="border-dashed border-bottom my-3"></div>{" "}
              <div className="row justify-content-evenly g-2">
                <button
                  className="btn btn-dark btn-lg col-5 text-center"
                  type="submit"
                  id="submitBtn"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg col-5 text-center"
                  onClick={() => handleReset({ resetForm })}
                >
                  Clear
                </button>
              </div>
            </Card.Body>
            <Card.Footer as="h6" class="text-center mt-3">
              <div>Points Value</div>
              <div className="border-dashed border-bottom my-1"></div>{" "}
              <div>10pts = $0.10</div>
              <div>100pts = $1.00</div>
              <div>1,000pts = $10.00</div>
              <div>10,000pts = $100.00</div>
            </Card.Footer>
          </Card>
          <div className="row justify-content-evenly g-2"></div>
        </Form>
      )}
    </Formik>
  );
};

export default PointSourceForm;
PointSourceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
