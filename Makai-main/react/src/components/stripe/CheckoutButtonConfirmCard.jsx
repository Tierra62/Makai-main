import React from "react";
import Card from "react-bootstrap/Card";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import * as stripeService from "../../services/stripeService";
import * as orderService from "../../services/orderService";
import * as insuranceOptionService from "../../services/insuranceOptionService";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import "./stripe.css";
import debug from "sabio-debug";
const _logger = debug.extend("transfer");

const stripePromise = loadStripe(process.env.REACT_APP_TEMP_STRIPE_PK_TEST);

function CheckoutButton(props) {
  const totalCost = (props.order.price / 100) * props.order.rentalTime;
  const displayPrice = props.order.price / 100;
  const orderCost = totalCost * props.order.quantity;
  const showTime = new Date(props?.order?.startTime).toLocaleString();
  const hasInsurance = props.order.insuranceCost > 0;
  const insuranceDisplayCost =
    Math.round(props.order.insuranceCost * 100) / 100; // zero if hasInsurance false
  const insuranceCostPerItem = insuranceDisplayCost / props.order.quantity; // zero if hasInsurance false

  const costInPennies = Math.round(totalCost * 100);
  const insuranceCostInPennies = Math.round(insuranceDisplayCost * 100);

  const startTime = props.order.startTime;
  const rentalTime = props.order.rentalTime;
  // Date.getTime() puts into milliseconds
  // so we have current time (in ms) = x rental Hours * 60 hours/min * 60 sec/hour * 1000 milliseconds/sec
  const endTime = new Date(startTime.getTime() + rentalTime * 60 * 60 * 1000);

  const stripeCost = Math.round((totalCost + insuranceCostPerItem) * 100); // to send to stripe
  const displayCost =
    Math.round((orderCost + insuranceCostPerItem) * 100) / 100; // if we set to stripedCost/100 is puts a bunch of decimals

  const onSubmitClick = () => {
    const payload = {
      cost: stripeCost,
      quantity: props.order.quantity,
      productName: props.order.name,
    };

    stripeService
      .addSession(payload)
      .then(onAddSessionSuccess)
      .catch(onAddSessionError);
  };

  const onAddSessionSuccess = async (response) => {
    _logger("Session Added", response);
    let sessionId = response?.data?.item;

    // once the cart is built combine orderInsert and insuraceInsert props (besides orderId) and then
    // send with payload as a cart add/insert

    // then in Checkout Success component access these properties from the cart table and do the orderInsert then the insuranceInsert there
    // and then do a cart delete to the orders ( might want to add a delete by userId proc)
    let orderInsert = {
      productId: props.order.productId,
      startTime: startTime,
      orderStatusId: 5,
      estimatedStop: endTime,
      priceInCents: costInPennies * props.order.quantity,
      stripeSessionId: sessionId,
    };
    _logger(orderInsert, "ORDER INSERT");
    orderService
      .addOrder(orderInsert)
      .then(onAddOrderSuccess)
      .catch(onAddOrderError);

    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: sessionId });
  };

  const onAddOrderSuccess = (data) => {
    if (hasInsurance) {
      let insuranceOptionInsert = {
        orderId: data.item,
        cost: insuranceCostInPennies,
      };
      insuranceOptionService
        .add(insuranceOptionInsert)
        .then(onAddInsuranceOptionSuccess)
        .catch(onAddInsuranceOptionError);
    } else {
      Toastify({
        text: "Thank you for your order!",
        className: "success",
        style: {
          background: "green",
        },
      }).showToast();
    }
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

  const onAddOrderError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const onAddInsuranceOptionSuccess = () => {
    Toastify({
      text: "Thank you for your order!",
      className: "success",
      style: {
        background: "green",
      },
    }).showToast();
  };

  const onAddInsuranceOptionError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  return (
    <div className="container text-center justify-content-center p-4 ">
      <div className=" col-sm-12 col-lg-6 ">
        <Card className="test-card success-card shadow-lg">
          <Card.Body>
            <h3>Confirm Order</h3>
            <p>Product: {props?.order?.name}</p>
            <p>Start Time: {showTime}</p>
            <p>Price per Hour: ${displayPrice}</p>
            <p>Rental Time: {props?.order?.rentalTime} hours</p>
            <p>Quantity: {props?.order?.quantity}</p>
            {hasInsurance && (
              <p>Insurance Cost: ${insuranceDisplayCost.toFixed(2)} </p>
            )}
            <h5>Total Cost: ${displayCost}</h5>
            <button
              onClick={onSubmitClick}
              className="btn btn-outline-primary m-2"
            >
              {" "}
              Checkout
            </button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
CheckoutButton.propTypes = {
  order: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    rentalTime: PropTypes.number.isRequired,
    finalCost: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.instanceOf(Date).isRequired,
    insuranceCost: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(CheckoutButton);
