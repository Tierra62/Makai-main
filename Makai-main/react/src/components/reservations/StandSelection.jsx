import { React, useState, useEffect } from "react";
import { withFormik, Form, Field, ErrorMessage } from "formik";
import { Card, Row, Col, Button } from "react-bootstrap";
import standsService from "services/standsService";
import { reservationStandSchema } from "schemas/reservationSchema";
import toastr from "toastr";
import "../landing/Landing.css";
import PropTypes from "prop-types";

const StandSelection = (props) => {
  const { nextLabel, isSubmitting, handleSubmit } = props;

  const [stands, setStands] = useState([]);

  useEffect(() => {
    standsService.getAllV2().then(onGetAllSuccess).catch(onGetAllError);
  }, []);

  const onGetAllSuccess = (response) => {
    setStands((prevState) => {
      let standsList = { ...prevState };
      standsList = response.data.items;
      return standsList;
    });
  };

  const onGetAllError = (error) => {
    toastr.error(`${error}`, "Stand information was not found.");
  };

  const mapStands = (aStand) => {
    return (
      <option value={aStand.id} key={`product_${aStand.id}`}>
        {aStand.location.lineOne}, {aStand.location.city},{" "}
        {aStand.location.state.col3}
      </option>
    );
  };

  const standsToMap = stands.map(mapStands);

  return (
    <Card.Body>
      <Row className="mb-5 d-flex justify-content-center">
        <Col lg={10} md={10} sm={12}>
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Select a Stand Location</h4>
            <div className="form-group mb-2">
              <label htmlFor="standId" className="form-label">
                Stand Selection
              </label>
              <Field
                as="select"
                className="form-select"
                name="standId"
                selected={stands.Id}
                id="standId"
              >
                <option value="">Select your stand ...</option>
                {standsToMap}
              </Field>
              <ErrorMessage
                name="standId"
                component="div"
                className="has-error"
              />
            </div>

            <div className="button-group">
              <Button
                type="submit"
                className="btn btn-secondary float-end mt-2 listing-loki-actions"
                disabled={isSubmitting}
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
  validationSchema: reservationStandSchema,
  handleSubmit: function (values, { props }) {
    props.onNext(values);
  },
})(StandSelection);

StandSelection.propTypes = {
  reservation: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    dateCheckIn: PropTypes.instanceOf(Date).isRequired,
    rentalTime: PropTypes.string.isRequired,
    chargeId: PropTypes.string.isRequired,
    statusId: PropTypes.number.isRequired,
  }),

  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  nextLabel: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  values: PropTypes.shape({
    productId: PropTypes.string.isRequired,
  }),
};
