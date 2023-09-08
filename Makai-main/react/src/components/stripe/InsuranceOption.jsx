import React, { useState, useEffect } from "react";
import { Card } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import debug from "sabio-debug";
import { insuranceOptionSchema } from "../../schemas/insuranceOptionSchema";
import "./stripe.css";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const _logger = debug.extend("transfer");
function InsuranceOption() {
  // There is a single insurance cost for each order which is 10% of the total order cost
  // However, to send it to stripe how we have (bundled with the total price)
  // it needs be evenly divisible up to 2 decimal places by the order quantity
  // If is not, then the item price sent to stripe will miscalculate the total price - it will round up the insurance cost for each item in the order
  // Ex: The order cost is $9.90, total insurance cost is $3.96, for 4 orders ()
  //      Then, insurance cost per item = 0.9975 -> $1.00
  //            we have to round because we want the customer to only see up to cents
  //      Then, total cost = ($9.90)*4 + ($1.00)*4 = $43.60
  //      Whereas, real total cost = ($9.90)*4 + $3.96 = $43.56

  // Thus, we round the insurance cost per item up and then calculate
  // the total price
  // Ex: Following above, real total cost = ($9.90)*4 + ($1.00)*4 = $43.60

  // Might be changed if we want to show the insurance cost as its own charge
  // for each of the orders we are checking out

  const [insuranceOptionInfo, setInsuranceOptionInfo] = useState({
    cost: 0,
    termsOfAgreement: false,
  });
  const navigate = useNavigate();

  const [orderInfo, setOrderInfo] = useState();
  const { state } = useLocation();
  useEffect(() => {
    if (state?.type === "ORDER_DETAILS_FOR_CART") {
      // get the cost per item
      const orderCostPerItem =
        (state.payload.price / 100) * state.payload.rentalTime;
      // get 10% of the orderCostPerItem rounded to the nearests 2 decimals
      const insuranceCostPerItemRounded =
        Math.round(orderCostPerItem * 0.1 * 100) / 100;
      // gets the totalInsurance cost based on the quantity and rounded Insurance cost per item
      const insuranceCost = (
        insuranceCostPerItemRounded * state.payload.quantity
      ).toFixed(2);
      _logger(orderInfo);

      setOrderInfo(state.payload);

      // If we want orderCost as 10% of total cost (not rounded per item):
      // const orderCost = (state.payload.price / 100) * state.payload.rentalTime * state.payload.quantity
      // const insuranceCost = Math.round((orderCost * 0.1) * 100) / 100

      setInsuranceOptionInfo((prevState) => {
        let pd = { ...prevState };
        pd.cost = insuranceCost;
        return pd;
      });
    }
  }, [state]);

  const handleSubmit = (values) => {
    _logger("add insurance firing");
    const orderForPayload = { ...orderInfo };
    // we add the insurance cost and user Id through the state we send to the CheckoutButtonConfirmCard
    // if insuranceCost > 0, then they must have agreed to the terms
    orderForPayload.insuranceCost = Number(values.cost);
    const stateForPayload = {
      type: "ORDER_DETAILS_FOR_CART",
      payload: orderForPayload,
    };
    navigate("/products/stripe/cart/checkout", { state: stateForPayload });
  };

  const handleSkip = () => {
    _logger("proceed without insurance firing");
    const orderForPayload = { ...orderInfo };
    // we add the insurance cost and user Id through the state we send to the CheckoutButtonConfirmCard
    // if insuranceCost == 0, then they have skipped adding insurance
    orderForPayload.insuranceCost = 0;
    const stateForPayload = {
      type: "ORDER_DETAILS_FOR_CART",
      payload: orderForPayload,
    };
    navigate("/products/stripe/cart/checkout", { state: stateForPayload });
  };

  return (
    <div className="container pt-4">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-sm-12 justify-content-center">
          <Card className="w-100 h-100 success-card">
            <Formik
              enableReinitialize={true}
              initialValues={insuranceOptionInfo}
              onSubmit={handleSubmit}
              validationSchema={insuranceOptionSchema}
            >
              <Form>
                <div className="card-body bg-light pb-0">
                  <div className="mb-3 text-center">Damage Waiver</div>
                  <div className="mb-3">
                    <label className="cost" htmlFor="cost">
                      Insurance Cost
                    </label>
                    <div className="row">
                      <strong className="col-1 mt-1">$</strong>
                      <Field
                        className="form-control col"
                        name="cost"
                        id="cost"
                        disabled={true}
                        value={insuranceOptionInfo.cost}
                      ></Field>
                    </div>

                    <ErrorMessage
                      name="cost"
                      component="div"
                      className="transferform-field-error"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="termsOfAgreement">
                      <Field
                        type="checkbox"
                        name="termsOfAgreement"
                        id="termsOfAgreement"
                      />
                      {"  "} I agree to the terms and conditions*
                    </label>
                    <ErrorMessage
                      name="termsOfAgreement"
                      component="div"
                      className="transferform-field-error"
                    />
                  </div>
                  <div className="row d-flex justify-content-center align-content-center">
                    <button
                      className="btn btn-primary d-block mt-3 mb-3 mx-1 justify-content-center"
                      type="submit"
                      name="submit"
                      style={{ width: "40%" }}
                    >
                      Add Insurance
                    </button>
                    <button
                      className="btn btn-warning d-block mt-3 mb-3 mx-1 justify-content-center"
                      type="button"
                      name="skip"
                      style={{ width: "40%" }}
                      onClick={handleSkip}
                    >
                      Proceed Without Insurance
                    </button>
                  </div>
                </div>
              </Form>
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  );
}

InsuranceOption.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};
export default InsuranceOption;
