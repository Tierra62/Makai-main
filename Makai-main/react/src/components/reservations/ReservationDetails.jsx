import { React, useEffect, useState } from "react";
import { withFormik, Form } from "formik";
import { Card, Row, Col, Button } from "react-bootstrap";
import "../landing/Landing.css";
import PropTypes from "prop-types";
import * as stripeService from "../../services/stripeService";
import ReservationCheckoutButton from "./ReservationCheckoutButton";

const ReservationDetails = (props) => {
  const {
    isSubmitting,
    backLabel,
    onBack,
    cantBack,
    handleSubmit,
    reservation,
  } = props;

  const [product, setProduct] = useState([]);

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  const formattedDate = reservation.dateCheckIn.toLocaleString(
    "en-US",
    options
  );

  useEffect(() => {
    if (reservation?.productId) {
      stripeService
        .getProductById(reservation.productId)
        .then(onGetSuccess)
        .catch(onGetError);
    }
  }, []);

  const onGetSuccess = (response) => {
    setProduct((prevState) => {
      let newProduct = { ...prevState };
      newProduct = response.item;
      return newProduct;
    });
  };

  const onGetError = (error) => {
    toastr.error(`${error}`, "Product information was not found.");
  };

  function formatDuration(minutes) {
    if (minutes < 60) {
      return minutes + " minutes";
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      const hoursString = hours === 1 ? "hour" : "hours";
      const minutesString = remainingMinutes === 1 ? "minute" : "minutes";
      if (remainingMinutes === 0) {
        return hours + " " + hoursString;
      } else {
        return (
          hours +
          " " +
          hoursString +
          ", " +
          remainingMinutes +
          " " +
          minutesString
        );
      }
    }
  }

  const getTotalCostInDollars = (priceInCents, rentalTime) => {
    let totalCost = 0;
    switch (rentalTime) {
      case "30":
        totalCost = priceInCents / 2;
        break;
      case "60":
        totalCost = priceInCents * 1;
        break;
      case "90":
        totalCost = priceInCents * 1.5;
        break;
      case "120":
        totalCost = priceInCents * 2;
        break;
      default:
        Toastify({
          text: "Unable to process total cost.",
          className: "error",
          style: {
            background: "crimson",
          },
        }).showToast();
    }
    const dollars = (totalCost / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return dollars;
  };

  const getTotalCostInCents = (priceInCents, rentalTime) => {
    let totalCost = 0;
    switch (rentalTime) {
      case "30":
        totalCost = priceInCents / 2;
        break;
      case "60":
        totalCost = priceInCents * 1;
        break;
      case "90":
        totalCost = priceInCents * 1.5;
        break;
      case "120":
        totalCost = priceInCents * 2;
        break;
      default:
        Toastify({
          text: "Unable to process total cost.",
          className: "error",
          style: {
            background: "crimson",
          },
        }).showToast();
    }
    const roundedTotalCost = Math.round(totalCost);
    return roundedTotalCost;
  };

  const order = {
    quantity: 1,
    name: product.name,
    finalCost: getTotalCostInCents(
      product.hourlyPriceInCents,
      reservation.rentalTime
    ),
  };

  return (
    <Card.Body>
      <Row className="mb-5 d-flex justify-content-center">
        <Col lg={10} md={10} sm={12}>
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Confirm your Reservation Details</h4>
            <div className="form-group mb-2">
              <h2 className="form-label">Reservation Details</h2>
              <p>Product: {product.name}</p>
              <p>Date Check-In: {formattedDate}</p>
              <p>Rental Time: {formatDuration(reservation.rentalTime)}</p>
              <p>
                Total Cost:{" "}
                {getTotalCostInDollars(
                  product.hourlyPriceInCents,
                  reservation.rentalTime
                )}
              </p>
            </div>
            <div className="button-group">
              <Button
                type="button"
                className="btn btn-secondary float-start mt-2 listing-loki-actions"
                onClick={onBack}
                disabled={isSubmitting || cantBack}
              >
                {backLabel}
              </Button>
              <ReservationCheckoutButton
                order={order}
                reservation={reservation}
              />
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
  handleSubmit: function (values, { props }) {
    props.onNext(values);
  },
})(ReservationDetails);

ReservationDetails.propTypes = {
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
    productId: PropTypes.string.isRequired,
  }),
};
