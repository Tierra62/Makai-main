import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Img1 from "../../assets/img/stripe/test1.jpg";
import Img2 from "../../assets/img/stripe/test2.jpg";
import Img3 from "../../assets/img/stripe/test3.jpg";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import * as stripeService from "../../services/stripeService";
import { loadStripe } from "@stripe/stripe-js";
import "./stripe.css";

const stripePromise = loadStripe(process.env.REACT_APP_TEMP_STRIPE_PK_TEST);

function TestProduct() {
  const defaultCharge = {
    cost: 0,
    quantity: 1,
    productName: "Standup Paddle Board",
  };
  const [currentCharge, setCurrentCost] = useState(defaultCharge);

  const onSubmitClick = (e) => {
    if (e.target.id === "2") {
      setCurrentCost((prevState) => {
        const currentCost = { ...prevState };
        currentCost.cost = 4000;
        return currentCost;
      });
    } else if (e.target.id === "1") {
      setCurrentCost((prevState) => {
        const currentCost = { ...prevState };
        currentCost.cost = 2500;
        return currentCost;
      });
    } else if (e.target.id === "6") {
      setCurrentCost((prevState) => {
        const currentCost = { ...prevState };
        currentCost.cost = 10000;
        return currentCost;
      });
    }

    addSession(currentCharge);
  };

  const addSession = (payload) => {
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
    <div className="container text-center p-4 ">
      <div className="row">
        <div className="col-sm-12 col-lg-4 p-4">
          <Card className="test-card shadow-lg">
            <Card.Img variant="top" className="test-img" src={Img1} />
            <Card.Body>
              <Card.Title>One Hour Rental</Card.Title>
              <Card.Title>$25</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the cards content.
              </Card.Text>
              <Button
                className="col-12"
                variant="primary"
                onClick={onSubmitClick}
                id="1"
              >
                Checkout
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-12 col-lg-4 p-4 justify-content-center">
          <Card className="test-card shadow-lg">
            <Card.Img variant="top" className="test-img" src={Img2} />

            <Card.Body>
              <Card.Title>Two Hour Rental</Card.Title>
              <Card.Title>$40</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the cards content.
              </Card.Text>

              <Button
                className="col-12"
                variant="primary"
                onClick={onSubmitClick}
                id="2"
              >
                Checkout
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-12 col-lg-4 p-4">
          <Card className="test-card shadow-lg">
            <Card.Img className="test-img" variant="top" src={Img3} />
            <Card.Body>
              <Card.Title>Six Hour Rental</Card.Title>
              <Card.Title> $100 </Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the cards content.
              </Card.Text>
              <Button
                className="col-12"
                variant="primary"
                onClick={onSubmitClick}
                id="6"
              >
                Checkout
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TestProduct);
