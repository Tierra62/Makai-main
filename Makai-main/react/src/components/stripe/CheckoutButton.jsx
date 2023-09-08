import React from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import * as stripeService from "../../services/stripeService";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import "./stripe.css";
import Button from "react-bootstrap/Button";

const stripePromise = loadStripe(process.env.REACT_APP_TEMP_STRIPE_PK_TEST);

function CheckoutButton(props) {
  const onSubmitClick = () => {
    const payload = {
      cost: props.order.finalCost,
      quantity: props.order.quantity,
      productName: props.order.name,
    };

    stripeService
      .addSession(payload)
      .then(onAddSessionSuccess)
      .catch(onAddSessionError);
  };

  const onAddSessionSuccess = async (response) => {
    let sessionId = response?.data?.item;
    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: sessionId });
  };

  const onAddSessionError = () => {
    Toastify({
      text: "Please Try Again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  return (
    <Button variant="primary" onClick={onSubmitClick}>
      Checkout
    </Button>
  );
}
CheckoutButton.propTypes = {
  order: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    finalCost: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(CheckoutButton);
