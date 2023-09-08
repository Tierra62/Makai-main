import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import registerImg from "../../assets/img/stripe/register.jpg";
import "./stripe.css";
import { useSearchParams } from "react-router-dom";
import * as stripeService from "../../services/stripeService";
import debug from "sabio-debug";
const _logger = debug.extend("transfer");

function CheckoutDetails() {
  const [orderReceipt, setOrderReceipt] = useState({
    amountTotal: "",
    paymentStatus: "",
    date: "",
    recipient: "Makai",
    transactionType: "Checkout",
    name: "",
    email: "",
    city: "",
    state: "",
    address: "",
    postalCode: "",
  });

  const [para] = useSearchParams();
  const sessionId = para.get("session_id");

  useEffect(() => {
    const payload = { sessionId: sessionId };

    stripeService
      .addOrderDetails(payload)
      .then(onAddOrderDetailsSuccess)
      .catch(onAddOrderDetailsError);
  }, []);

  const onAddOrderDetailsSuccess = (response) => {
    _logger(response, "reseponse");
    let orderDate = new Date(response?.data?.item?.created).toLocaleString();
    setOrderReceipt((prevState) => {
      const orderData = { ...prevState };
      (orderData.amountTotal = response?.data?.item?.amountTotal),
        (orderData.sessionId = response?.data?.item?.id),
        (orderData.name = response?.data?.item?.customerDetails?.name),
        (orderData.email = response?.data?.item?.customerDetails?.email),
        (orderData.city = response?.data?.item?.customerDetails?.address?.city),
        (orderData.state =
          response?.data?.item?.customerDetails?.address?.state),
        (orderData.address =
          response?.data?.item?.customerDetails?.address?.line1),
        (orderData.postalCode =
          response?.data?.item?.customerDetails?.address?.postalCode),
        (orderData.date = orderDate),
        (orderData.paymentStatus = response?.data?.item?.paymentStatus);

      return orderData;
    });
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

  return (
    <div className="container text-center p-2">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-sm-12 h-75 ">
          <Card className="success-card ">
            <Card.Body>
              <Card.Title>Thank you for your order!</Card.Title>
              <Card.Text>
                <div className="row justify-content-center pull-left">
                  <Card className="col-lg-6 d-flex text-start">
                    <Card.Body>
                      <p className="text-center">
                        ---------------------------------------
                      </p>
                      <Card.Text>
                        Payer: <strong>{orderReceipt.name}</strong>
                        <br />
                        Email: <strong>{orderReceipt.email}</strong>
                        <br />
                        Billing Zip Code:{" "}
                        <strong>{orderReceipt?.postalCode}</strong>
                        <br />
                        Amount:{" "}
                        <strong>${orderReceipt?.amountTotal / 100}</strong>
                        <br />
                        Status: <strong>{orderReceipt?.paymentStatus}</strong>
                        <br />
                        Date Paid: <strong>{orderReceipt?.date}</strong>
                      </Card.Text>
                      <p className="text-center">
                        ---------------------------------------
                      </p>
                    </Card.Body>
                  </Card>
                </div>
                <p className="pt-4">
                  We appreciate your business and hope you enjoy your ocean
                  experience! If you have any questions, please email us at:{" "}
                  <a href="mailto:orders@example.com">orders@makai.com</a>
                </p>
              </Card.Text>
            </Card.Body>
            <Card.Img variant="top" src={registerImg} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CheckoutDetails);
