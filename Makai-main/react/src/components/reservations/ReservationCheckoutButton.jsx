import React from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import * as stripeService from "../../services/stripeService";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import reservationService from "services/reservationService";

const stripePromise = loadStripe(process.env.REACT_APP_TEMP_STRIPE_PK_TEST);

function ReservationCheckoutButton(props) {
  const onSubmitClick = () => {
    const payload = {
      cost: props.order.finalCost,
      quantity: props.order.quantity,
      productName: props.order.name,
    };

    stripeService
      .reservationAddSession(payload)
      .then(onAddSessionSuccess)
      .catch(onAddSessionError);
  };

  const onAddSessionSuccess = async (data) => {
    let sessionId = data?.item;

    const payload = {
      productId: props.reservation.productId,
      dateCheckIn: props.reservation.dateCheckIn,
      rentalTime: props.reservation.rentalTime,
      chargeId: sessionId,
      statusId: props.reservation.statusId,
    };

    reservationService
      .addReservation(payload)
      .then(onAddReservationSuccess)
      .catch(onAddReservationError);

    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: sessionId });
  };

  const onAddSessionError = () => {
    Toastify({
      text: "Stripe session was not initialized, please try again.",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const onAddReservationSuccess = () => {
    Toastify({
      text: "Reservation added successfully!",
      className: "success",
      style: {
        background: "green",
      },
    }).showToast();
  };

  const onAddReservationError = () => {
    Toastify({
      text: "Reservation was not added!",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  return (
    <Button
      variant="primary"
      onClick={onSubmitClick}
      className="btn btn-primary float-end mt-2 listing-loki-actions"
    >
      Checkout
    </Button>
  );
}
ReservationCheckoutButton.propTypes = {
  order: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    finalCost: PropTypes.number.isRequired,
  }).isRequired,
  reservation: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    dateCheckIn: PropTypes.instanceOf(Date).isRequired,
    rentalTime: PropTypes.number.isRequired,
    chargeId: PropTypes.string.isRequired,
    statusId: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(ReservationCheckoutButton);
