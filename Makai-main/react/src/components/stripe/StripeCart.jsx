import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import * as stripeService from "../../services/stripeService";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useField,
  useFormikContext,
} from "formik";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../landing/Landing.css";
import "../stripe/stripe.css";
import { stripeCartSchema } from "../../schemas/stripeSchema.js";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams, useNavigate } from "react-router-dom";

import debug from "sabio-debug";

const _logger = debug.extend("stripeCart");

const StripeCart = () => {
  const [cartDetails, setCartDetails] = useState({
    id: 0,
    price: 0,
    name: "",
    photoUrl: "",
    finalCost: 100,
    startTime: "",
    rentalTime: "",
  });
  const navigate = useNavigate();
  const [para] = useSearchParams();
  const productId = para.get("product_Id");

  useEffect(() => {
    stripeService
      .getProductById(productId)
      .then(onGetByProductIdSuccess)
      .catch(onGetByProductIdError);
  }, []);

  const onGetByProductIdSuccess = (response) => {
    _logger(response);
    setCartDetails((prevState) => {
      const orderData = { ...prevState };
      (orderData.id = response?.item?.id),
        (orderData.price = response?.item?.hourlyPriceInCents),
        (orderData.name = response?.item?.name),
        (orderData.photoUrl = response?.item?.url);

      return orderData;
    });
  };

  const onGetByProductIdError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const filterTime = (date) => {
    const isPastTime = new Date().getTime() > date.getTime();
    return !isPastTime;
  };

  const currentDate = new Date();
  currentDate.setHours(new Date().getHours());
  currentDate.setMinutes(new Date().getMinutes());

  const minTime = new Date();
  minTime.setHours(0);
  minTime.setMinutes(0);

  const maxTime = new Date();
  maxTime.setHours(1);
  maxTime.setMinutes();

  const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
      <DatePicker
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
      />
    );
  };

  const initialValues = {
    productId: "",
    dateCheckIn: currentDate,
    rentalTime: 0,
    chargeId: uuidv4(),
    statusId: 1,
    quantity: 0,
  };

  const [formData] = useState(initialValues);

  const handleCalendarInput = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (values) => {
    // For payload obj below
    const prevCartData = { ...cartDetails };
    setCartDetails((prevState) => {
      const cartData = { ...prevState };
      mapInputToCartDetails(cartData, values);
      return cartData;
    });

    // I need to wait for setCartDetails for finish first
    // Not sure how to do that (await) so I will just do the same thing as above
    const newCartData = prevCartData; // no need to copy again w/ spread op
    mapInputToCartDetails(newCartData, values);
    newCartData.productId = Number(productId);
    const stateForPayload = {
      type: "ORDER_DETAILS_FOR_CART",
      payload: newCartData,
    };
    navigate(`insurance`, { state: stateForPayload });
  };

  const mapInputToCartDetails = (cartData, values) => {
    (cartData.startTime = values.dateCheckIn),
      (cartData.rentalTime = parseInt(values.rentalTime, 10) / 60),
      (cartData.statusId = 1),
      (cartData.quantity = parseInt(values.quantity, 10));
  };

  return (
    <div className="container pt-4">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-sm-12 justify-content-center text-center ">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Card className="w-100 h-100 success-card">
            <Card.Img src={cartDetails.photoUrl} variant="top" />
            <div className="card-header">
              <h5 className="mb-0">Select Order Details</h5>
              <h6 className="m-2">Product name: ${cartDetails.name}</h6>
              <h6 className="">Price per Hour: ${cartDetails.price / 100}</h6>
            </div>
            <Formik
              enableReinitialize={true}
              initialValues={formData}
              onSubmit={handleSubmit}
              validationSchema={stripeCartSchema}
            >
              <Form>
                <div className="card-body bg-light pb-0">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="dateCheckIn">
                      Order Date & Time
                    </label>
                    <DatePickerField
                      className="form-control"
                      name="dateCheckIn"
                      selected={initialValues.dateCheckIn}
                      showTimeSelect
                      timeIntervals={15}
                      filterTime={filterTime}
                      minDate={currentDate}
                      minTime={minTime}
                      maxTime={maxTime}
                      onKeyDown={handleCalendarInput}
                      dateFormat="EEEE, MMMM d - h:mm aa"
                    />
                    <ErrorMessage
                      name="dateCheckIn"
                      component="div"
                      className="transferform-field-error"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="rentalTime">
                      Rental Time
                    </label>
                    <Field
                      as="select"
                      className="form-select"
                      name="rentalTime"
                      id="rentalTime"
                    >
                      <option value="">Select your rental time... </option>
                      <option value="60">1:00 hr.</option>
                      <option value="90">1:30 hr.</option>
                      <option value="120">2:00 hr.</option>
                      <option value="150">2:30 hrs.</option>
                      <option value="180">3:00 hrs.</option>
                      <option value="210">3:30 hrs.</option>
                      <option value="240">4:00 hrs.</option>
                      <option value="270">4:30 hrs.</option>
                      <option value="300">5:00 hrs.</option>
                      <option value="330">5:30 hrs.</option>
                      <option value="360">6:00 hrs.</option>
                      <option value="390">6:30 hrs.</option>
                      <option value="420">7:00 hrs.</option>
                      <option value="450">7:30 hrs.</option>
                      <option value="480">8:00 hrs.</option>
                      <option value="510">8:30 hrs.</option>
                      <option value="540">9:00 hrs.</option>
                    </Field>
                    <ErrorMessage
                      name="rentalTime"
                      component="div"
                      className="transferform-field-error"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="quantity">
                      Quantity of {cartDetails.name}
                    </label>
                    <Field
                      as="select"
                      className="form-select"
                      name="quantity"
                      id="quantity"
                    >
                      <option value="">Select the quantity... </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </Field>
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="transferform-field-error"
                    />
                  </div>
                  <div className="row d-flex justify-content-center align-content-center">
                    <button
                      className="btn btn-primary d-block w-50 mt-3 mb-3 justify-content-center"
                      type="submit"
                      name="submit"
                    >
                      Next
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
};

export default React.memo(StripeCart);
