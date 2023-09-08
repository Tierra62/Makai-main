import React, { useEffect, useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import PropTypes from "prop-types";
import debug from "sabio-debug";

const _logger = debug.extend("Charity");

function ButtonPaypal(props) {
  const [amount, setAmount] = useState(null);
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    setAmount(props.amount);
    _logger("this are isPending", isPending);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
      },
    });
  }, [props.amount]);

  /*
  buttonStyle is not CSS styles but from @paypal/react docs
  Also, eslint disable for the paypal button because it needs variables declared not in camelCase
    */

  const buttonStyle = {
    layout: "horizontal",
    label: "donate",
    tagline: false,
    category: "DONATION",
  };

  return (
    <>
      <PayPalButtons
        /*eslint camelcase: ["error", {properties: "never"}]*/
        fundingSource="paypal"
        style={buttonStyle}
        disabled={false}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    breakdown: {
                      item_total: {
                        currency_code: "USD",
                        value: amount,
                      },
                    },
                  },
                  items: [
                    {
                      name: "donation-example",
                      quantity: "1",
                      unit_amount: {
                        currency_code: "USD",
                        value: amount,
                      },
                      category: "DONATION",
                    },
                  ],
                },
              ],
            })
            .then((orderId) => {
              _logger("this is orderId", orderId);
              props.setPayload(orderId);
              return orderId;
            });
        }}
        onApprove={() => {
          props.createDonation();
        }}
      />
    </>
  );
}

ButtonPaypal.propTypes = {
  amount: PropTypes.number.isRequired,
  setPayload: PropTypes.func.isRequired,
  createDonation: PropTypes.func.isRequired,
};

export default ButtonPaypal;
