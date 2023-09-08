import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import SuccessImg from "../../assets/img/stripe/success.jpg";
import "./stripe.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import * as stripeService from "../../services/stripeService";
import * as orderService from "../../services/orderService";
import { useSearchParams, useNavigate } from "react-router-dom";
import debug from "sabio-debug";
const _logger = debug.extend("transfer");

function CheckoutSuccess() {
  const [orderReceipt, setOrderReceipt] = useState({
    amountTotal: "",
    sessionId: "",
    paymentStatus: "",
    recipient: "Makai",
    transactionType: "Checkout",
  });

  const [para] = useSearchParams();
  const searchParam = para.get("session_id");
  const navigate = useNavigate();
  const splitSearchParams = searchParam.split(":");
  const sessionId = splitSearchParams[0];

  useEffect(() => {
    const payload = { sessionId: sessionId };

    stripeService
      .addOrderDetails(payload)
      .then(onAddOrderDetailsSuccess)
      .catch(onAddOrderDetailsError);
  }, []);

  const onAddOrderDetailsSuccess = (response) => {
    _logger("addOrderDetails (stripeService)", response);
    let payload = {
      amountTotal: response?.data?.item?.amountTotal,
      stripeSessionId: response?.data?.item?.id,
      paymentStatus: response?.data?.item?.paymentStatus,
      recipient: orderReceipt.recipient,
      transactionType: orderReceipt.transactionType,
    };

    setOrderReceipt((prevState) => {
      const orderData = { ...prevState };
      (orderData.amountTotal = response?.data?.item?.amountTotal),
        (orderData.sessionId = response?.data?.item?.id),
        (orderData.paymentStatus = response?.data?.item?.paymentStatus);
      return orderData;
    });

    stripeService
      .addTransactionReceipt(payload)
      .then(onAddOrderReceiptSuccess)
      .catch(onAddOrderReceiptError);
  };

  const onAddOrderDetailsError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const onAddOrderReceiptError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const onAddOrderReceiptSuccess = () => {
    _logger("addTransactionReciept (stripeService)");

    const payload = { sessionId: sessionId };

    stripeService
      .getLineItems(payload)
      .then(onGetLineItemsSuccess)
      .catch(onGetLineItemsError);
  };

  const onGetLineItemsSuccess = (response) => {
    _logger("getLineItems()", response);
    // gets checkout items
    // will need to be used once we have multiple items I think
    const payload = {
      orderStatusId: 2,
      stripeSessionId: sessionId,
    };
    orderService
      .updateOrderStatus(payload)
      .then(onUpdateOrderStatusSuccess)
      .catch(onUpdateOrderStatusError);
  };

  const onGetLineItemsError = (error) => {
    _logger(error);
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const onUpdateOrderStatusSuccess = () => {
    Toastify({
      text: "Thank you for your order!",
      className: "success",
      style: {
        background: "green",
      },
    }).showToast();
  };

  const navigateDetails = () => {
    navigate(`/stripe/checkout/details?session_id=${sessionId}`);
  };

  return (
    <div className="text-center p-2">
      <div className="container">
        <div className="col-lg-8 col-sm-12 h-75 d-inline-block">
          <Card className="success-card shadow-lg">
            <Card.Body>
              <Card.Title>Thank you for your order!</Card.Title>
              <Card.Text>
                We appreciate your business! If you have any questions, please
                email us at:{" "}
                <a href="mailto:orders@example.com">orders@makai.com</a>{" "}
              </Card.Text>
              <button
                onClick={navigateDetails}
                className="btn btn-outline-primary m-2"
              >
                View Order Details
              </button>
            </Card.Body>
            <Card.Img src={SuccessImg} className="h-75 d-inline-block" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CheckoutSuccess);
