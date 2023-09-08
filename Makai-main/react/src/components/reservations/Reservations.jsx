import React from "react";
import { reservationDateSchema } from "schemas/reservationSchema";
import {
  withFormik,
  useField,
  useFormikContext,
  Form,
  Field,
  ErrorMessage,
} from "formik";
import { Card, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../landing/Landing.css";
import PropTypes from "prop-types";

const Reservations = (props) => {
  const {
    nextLabel,
    isSubmitting,
    backLabel,
    onBack,
    cantBack,
    handleSubmit,
    handleChange,
    handleBlur,
  } = props;

  const filterTime = (date) => {
    const isPastTime = new Date().getTime() > date.getTime();
    return !isPastTime;
  };

  const currentDate = new Date();
  currentDate.setHours(new Date().getHours());
  currentDate.setMinutes(new Date().getMinutes());

  const minTime = new Date();
  minTime.setHours(5);
  minTime.setMinutes(0);

  const maxTime = new Date();
  maxTime.setHours(20);
  maxTime.setMinutes(0);

  const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
      <DatePicker
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
      />
    );
  };

  const handleCalendarInput = (e) => {
    // This function disables manual date and time inputs. (User could previously input disabled values despite DatePicker constraints).
    e.preventDefault();
  };

  return (
    <Card.Body>
      <Row className="mb-5 d-flex justify-content-center">
        <Col lg={10} md={10} sm={12}>
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Check-In Date & Time</h4>
            <div className="form-group mb-2">
              <label htmlFor="dateCheckIn" className="form-label">
                Check-In Date
              </label>
              <DatePickerField
                className="form-control"
                name="dateCheckIn"
                showTimeSelect
                timeIntervals={15}
                filterTime={filterTime}
                selected={currentDate}
                minDate={currentDate}
                minTime={minTime}
                maxTime={maxTime}
                onKeyDown={handleCalendarInput}
                dateFormat="EEEE, MMMM d - h:mm aa"
              />
              <ErrorMessage
                name="dateCheckIn"
                component="div"
                className="has-error"
              />
              <div className="mb-3">
                <label className="form-label" htmlFor="rentalTime">
                  Rental Time
                </label>
                <Field
                  as="select"
                  className="form-select"
                  name="rentalTime"
                  id="rentalTime"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select your rental time ... </option>
                  <option value="30">30 min.</option>
                  <option value="60">1:00 hr.</option>
                  <option value="90">1:30 hr.</option>
                  <option value="120">2:00 hrs.</option>
                </Field>
                <ErrorMessage
                  name="rentalTime"
                  component="div"
                  className="has-error"
                />
              </div>
            </div>
            <div>
              <Button
                type="button"
                onClick={onBack}
                disabled={isSubmitting || cantBack}
                className="btn btn-secondary float-start mt-2 listing-loki-actions"
              >
                {backLabel}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-secondary float-end mt-2 listing-loki-actions"
              >
                {nextLabel}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Card.Body>
  );
};

export default withFormik({
  mapPropsToValues: (props) => ({
    productId: props.reservation.productId,
    dateCheckIn: props.reservation.dateCheckIn,
    rentalTime: props.reservation.rentalTime,
    chargeId: props.reservation.chargeId,
    statusId: props.reservation.statusId,
  }),
  validationSchema: reservationDateSchema,
  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(Reservations);

Reservations.propTypes = {
  reservation: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    dateCheckIn: PropTypes.instanceOf(Date).isRequired,
    rentalTime: PropTypes.number.isRequired,
    chargeId: PropTypes.string.isRequired,
    statusId: PropTypes.number.isRequired,
  }),

  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  nextLabel: PropTypes.string.isRequired,
  backLabel: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  cantBack: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setReservation: PropTypes.func,
  values: PropTypes.shape({
    dateCheckIn: PropTypes.string.isRequired,
    rentalTime: PropTypes.number.isRequired,
  }),
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
