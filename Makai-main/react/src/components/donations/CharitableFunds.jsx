import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CharityCard from "./CharityCard";
import ButtonPaypal from "./ButtonPaypal";
import Toastify from "toastify-js";
import swal from "sweetalert";
import debug from "sabio-debug";
import * as donateService from "../../services/donateService";
import "./donations.css";

const _logger = debug.extend("Charity");

function CharitableFunds() {
  /*
  Formik is not used here because:
  1.- There are not onSubmit behavior,
  2.- The onChange behavior needed to be more personalize and the one that comes by default in Formik doesn't fullfil the desaired behavior
  3.- The two inputs needed are for structure purposes only.
  4.- The customization of the inputs are not compatible with the Formik Field component.
  ---- approved the not use of Formik on the Q by instructors -------
    */

  const [pageData, setPageData] = useState({
    charities: [],
    pageIndex: 0,
    pageSize: 7,
    totalCount: 0,
    currentPage: 1,
    payload: {
      charitableFundId: 0,
      orderId: "",
      unitCost: 0,
    },
    regularChecked: false,
    amountChecked: false,
  });
  const [currentCharity, setCurrentCharity] = useState(null);

  const initialOptions = {
    "client-id": "test",
    currency: "USD",
    components: "buttons",
  };

  useEffect(() => {
    if (pageData.charities.length < 1) {
      donateService
        .getCharities(pageData.pageIndex, pageData.pageSize)
        .then(onGetCharitiesSuccess)
        .catch(onGetCharitiesError);
    }
  }, [pageData.pageIndex]);

  const onGetCharitiesSuccess = (response) => {
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.charities = response.item?.pagedItems;
      pd.totalCount = response.item?.totalCount;
      return pd;
    });
  };

  const onGetCharitiesError = (error) => {
    _logger(error);
    Toastify({
      text: "Unable to fulfill request!",
      className: "error",
      style: {
        background: "linear-gradient(to right, #B00000, #B00000)",
      },
    }).showToast();
  };

  const mapCharityOptions = (charity) => {
    return (
      <option value={Number(charity.id)} key={`charity_${charity.id}`}>
        {charity.name}
      </option>
    );
  };

  const handleOnChange = (e) => {
    setPageData((prevState) => {
      const newData = { ...prevState };
      newData.payload[e.target.name] = Number(e.target.value);
      return newData;
    });
    if (e.target.id === "charitableFundId") {
      setCurrentCharity(
        pageData.charities[
          pageData.charities.findIndex((obj) => {
            return Number(obj.id) === Number(e.target.value);
          })
        ]
      );
    }
  };

  // Functions to create Donation
  const readyPayload = (uuid) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.payload.orderId = uuid;
      return newState;
    });
  };

  const createDonation = () => {
    donateService
      .addDonation(pageData.payload)
      .then(onCreateDonationSuccess)
      .catch(onCreateDonationError);
  };

  const onCreateDonationSuccess = () => {
    swal({
      title: "Thank you!",
      text: "Your donation will help improve the quality of life of many people!",
      icon: "success",
      button: "Accept",
    });
  };

  const onCreateDonationError = (error) => {
    _logger(error, "Couldn't make the donation");
    Toastify({
      text: "Error making donation. Try again.",
      className: "Error",
      style: {
        background: "linear-gradient(to right, #ff3703, #ff5903)",
      },
    }).showToast();
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.id === "customAmount") {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.isChecked = true;
        return newState;
      });
    }
  };
  return (
    <>
      <Container className="mt-5">
        <Card>
          <Row>
            <Col>
              {pageData.payload.charitableFundId ? (
                <CharityCard charity={currentCharity} />
              ) : (
                <Card className="donate-single-charity-card"></Card>
              )}
            </Col>
            <Col className="p-5">
              <Card.Body>
                <Card.Title>
                  <h2>Donate Now</h2>
                </Card.Title>
                <Row className="mt-5">
                  <h5 className="mb-3">Select your favorite Charity Fund:</h5>
                  <select
                    name="charitableFundId"
                    id="charitableFundId"
                    className="form-select form-select-lg mb-3"
                    aria-label=".form-select-lg example"
                    onChange={handleOnChange}
                  >
                    <option value="">Select Charity Fund</option>
                    {pageData.charities.map(mapCharityOptions)}
                  </select>
                </Row>
                <Row className="mt-4 justify-content-md-center">
                  <h5 className="mb-3">Select an amount: </h5>
                  <Row>
                    <Col>
                      <input
                        id="customAmount"
                        className="donate-amount-label text-center"
                        placeholder="ENTER AN AMOUNT"
                        name="unitCost"
                        onChange={handleOnChange}
                        onClick={handleClick}
                        value={pageData.payload.unitCost}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="auto">
                      <input
                        type="radio"
                        className="btn-check"
                        name="unitCost"
                        id="5USD"
                        autoComplete="off"
                        onChange={handleOnChange}
                        value="5"
                        checked={pageData.payload.unitCost === 5}
                      />
                      <label
                        className="btn btn-outline-dark rounded-pill btn-sm pt-2 pb-2"
                        htmlFor="5USD"
                      >
                        5 USD
                      </label>
                    </Col>
                    <Col md="auto">
                      <input
                        type="radio"
                        className="btn-check"
                        name="unitCost"
                        id="10USD"
                        autoComplete="off"
                        onChange={handleOnChange}
                        value="10"
                        checked={pageData.payload.unitCost === 10}
                      />
                      <label
                        className="btn btn-outline-dark rounded-pill btn-sm pt-2 pb-2"
                        htmlFor="10USD"
                      >
                        10 USD
                      </label>
                    </Col>
                    <Col md="auto">
                      <input
                        type="radio"
                        className="btn-check"
                        name="unitCost"
                        id="20USD"
                        autoComplete="off"
                        onChange={handleOnChange}
                        value="20"
                        checked={pageData.payload.unitCost === 20}
                      />
                      <label
                        className="btn btn-outline-dark rounded-pill btn-sm pt-2 pb-2"
                        htmlFor="20USD"
                      >
                        20 USD
                      </label>
                    </Col>
                    <Col md="auto">
                      <input
                        type="radio"
                        className="btn-check"
                        name="unitCost"
                        id="30USD"
                        autoComplete="off"
                        onChange={handleOnChange}
                        value="30"
                        checked={pageData.payload.unitCost === 30}
                      />
                      <label
                        className="btn btn-outline-dark rounded-pill btn-sm pt-2 pb-2"
                        htmlFor="30USD"
                      >
                        30 USD
                      </label>
                    </Col>
                    <Col md="auto">
                      <input
                        type="radio"
                        className="btn-check"
                        id="customUSD"
                        autoComplete="off"
                        checked={
                          pageData.payload.unitCost !== 5 &&
                          pageData.payload.unitCost !== 10 &&
                          pageData.payload.unitCost !== 20 &&
                          pageData.payload.unitCost !== 30
                        }
                      />
                      <label
                        className="btn btn-outline-dark rounded-pill btn-sm pt-2 pb-2"
                        htmlFor="customUSD"
                      >
                        custom amount
                      </label>
                    </Col>
                  </Row>
                </Row>
                <Row className="justify-content-md-center mt-5">
                  <Col xs lg="6">
                    <h4 className="pt-2">Total Donation: </h4>
                  </Col>
                  <Col md="auto">
                    <h3 className="donate-total-amount">
                      ${pageData.payload.unitCost}
                    </h3>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <PayPalScriptProvider options={initialOptions}>
                    {pageData.payload.charitableFundId !== 0 ? (
                      <ButtonPaypal
                        amount={pageData.payload.unitCost}
                        setPayload={readyPayload}
                        createDonation={createDonation}
                      />
                    ) : (
                      <h6 className="text-danger">
                        Please select a Charity Fund
                      </h6>
                    )}
                  </PayPalScriptProvider>
                </Row>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}

export default CharitableFunds;
