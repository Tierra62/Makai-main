import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "./stripe.css";
import * as stripeService from "../../services/stripeService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { stripeTransferSchema } from "../../schemas/stripeSchema.js";
import debug from "sabio-debug";
const _logger = debug.extend("transfer");

function TransferCard() {
  const [transferFormData] = useState({
    partnerId: "",
    amount: "",
  });

  const submitTransfer = (values, { resetForm }) => {
    const costInPennies = values.amount * 100;
    const stripeCost = Math.round(costInPennies);
    let payload = {
      amount: stripeCost,
      AccountId: values.partnerId,
    };

    stripeService
      .transferPayment(payload)
      .then((response) => onTransferPaymentSuccess(response, resetForm))
      .catch(onTransferPaymentError);
  };

  const onTransferPaymentSuccess = (response, resetForm) => {
    const payload = { accountId: response.data.item };

    stripeService
      .getTransferDetails(payload)
      .then(onGetTransferDetailsSuccess)
      .catch(onGetTransferDetailsError);

    Toastify({
      text: "Transfer Successfully Completed",
      className: "success",
      style: {
        background: "green",
      },
    }).showToast();

    resetForm();
  };

  const onTransferPaymentError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const onGetTransferDetailsSuccess = (response) => {
    const payload = {
      stripeSessionId: response?.data?.item?.id,
      recipient: response?.data?.item?.destinationId,
      amountTotal: response?.data?.item?.amount,
      paymentStatus: "paid",
      transactionType: "Transfer",
    };

    stripeService
      .addTransactionReceipt(payload)
      .then(onAddTransactionReceiptSuccess)
      .catch(onAddTransactionReceiptError);
  };

  const onGetTransferDetailsError = (error) => {
    _logger(error);
  };

  const onAddTransactionReceiptSuccess = (response) => {
    _logger(response, "receipt response");
  };

  const onAddTransactionReceiptError = (error) => {
    _logger(error);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-sm-12 justify-content-center ">
          <Card className="success-card">
            <Card.Img variant="top" src="" />
            <Card.Body>
              <Card.Title className="text-center">
                Transfer Payment to a Partner Account
              </Card.Title>
              <Formik
                enableReinitialize={true}
                initialValues={transferFormData}
                validationSchema={stripeTransferSchema}
                onSubmit={submitTransfer}
              >
                <Form>
                  <div className="mb-3 form-group" id="partnerCard">
                    <label htmlFor="partnerId">Partner Account Id:</label>
                    <Field
                      type="text"
                      name="partnerId"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="partnerId"
                      component="div"
                      className="transferform-field-error"
                    />
                  </div>

                  <div className="mb-3 form-group" id="partnerCard">
                    <label htmlFor="amount">Amount</label>
                    <Field
                      type="number"
                      name="amount"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="transferform-field-error"
                    />
                  </div>

                  <button type="submit" className="mb-2 mt-1 btn btn-primary">
                    Submit
                  </button>
                </Form>
              </Formik>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TransferCard);
