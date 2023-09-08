import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import registerImg from "../../assets/img/stripe/register.jpg";
import "./stripe.css";
import * as stripeService from "../../services/stripeService";
import PropTypes from "prop-types";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useNavigate } from "react-router-dom";

function Partner(props) {
  const { id, email } = props.currentUser;
  const defaultStripeAccount = { stripeAccountId: "", name: "" };
  const [stripeAccount, setStripeAccount] = useState(defaultStripeAccount);
  const navigate = useNavigate();

  useEffect(() => {
    stripeService
      .getAccount(id)
      .then(onGetAccountSuccess)
      .catch(onAddAccountError);
  }, []);

  const onSubmitClick = () => {
    let payload = {
      email: email,
    };
    stripeService
      .addAccount(payload)
      .then(onAddAccountSuccess)
      .catch(onAddAccountError);
  };

  const onAccountClick = () => {
    navigate("/stands/new");
  };

  const onAddAccountSuccess = (response) => {
    const userStripeId = { accountId: response?.item };

    stripeService
      .addAccountLink(userStripeId)
      .then(onAddAccountLinkSuccess)
      .catch(onAddAccountLinkError);

    let payload = {
      stripeAccountId: userStripeId.accountId,
      name: email,
      userId: id,
    };

    stripeService
      .addAccountToDatabase(payload)
      .then(onAddAccountToDatabaseSuccess)
      .catch(onAddAccountToDatabaseError);
  };

  const onAddAccountLinkSuccess = (response) => {
    window.location = response?.item;
  };

  const onAddAccountError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const onAddAccountLinkError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };
  const onGetAccountSuccess = (response) => {
    setStripeAccount((prevState) => {
      const accountData = { ...prevState };
      (accountData.stripeAccountId = response?.item?.stripeAccountId),
        (accountData.name = response?.item?.name);
      return accountData;
    });
  };

  const onAddAccountToDatabaseSuccess = () => {
    Toastify({
      text: "Thanks for joining!",
      className: "success",
      style: {
        background: "green",
      },
    }).showToast();
    setStripeAccount((prevState) => {
      const accountData = { ...prevState };
      (accountData.stripeAccountId = ""), (accountData.name = "");
      return accountData;
    });
  };

  const onAddAccountToDatabaseError = () => {
    Toastify({
      text: "Please try again!",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  return (
    <div className="d-flex justify-content-center container p-7">
      <div className="row">
        <div className="col-12 justify-content-center">
          <Card className="stripepartner-card shadow-lg">
            <Card.Img
              className="partner-image"
              variant="top"
              src={registerImg}
            />
            <Card.Body className="text-center">
              <Card.Title>
                Thank you for registering to be a partner! We are excited to
                begin working with you.
              </Card.Title>
              {!stripeAccount.stripeAccountId ? (
                <>
                  <p className="p-4">
                    In order to recieve payments from us we will need you to
                    also register an account with Stripe. It is free, and easy,
                    just click below!
                  </p>
                  <button
                    onClick={onSubmitClick}
                    type="button"
                    className="btn btn-primary p-3 m-6"
                  >
                    Join Our Team!
                  </button>
                </>
              ) : (
                <h3 className="p-6">
                  Your Stripe Account ID is:{" "}
                  <strong className="p-2">
                    {stripeAccount.stripeAccountId}
                  </strong>
                  <button
                    onClick={onAccountClick}
                    type="button"
                    className="btn btn-primary p-3 m-6"
                  >
                    Click to register your stand
                  </button>
                </h3>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

Partner.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(Partner);
