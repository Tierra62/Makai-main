import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import QuantityController from "./QuantityController";
import moment from "moment";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { Formik, Form, ErrorMessage } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import "../stripe/stripe.css";

import debug from "sabio-debug";

const _logger = debug.extend("shoppingCart");
const _loggersci = _logger.extend("item");

function ShoppingCartItem(props) {
  _loggersci("props", props);
  const { cartItem } = props;

  const [timeData] = useState(initialValues);

  const onRemoveClicked = (e) => {
    _loggersci("onRemoveClicked", e);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3998a6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        props.onDeleteClicked(cartItem);
        Swal.fire({
          title: "Deleted!",
          text: "Item removed from cart",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  //#region QUANTITY

  const handleIncrease = () => {
    props.onQtyUpdateClicked(cartItem, 1);
  };

  const handleDecrease = () => {
    if (cartItem.quantity === 1) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3998a6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          props.onDeleteClicked(cartItem);
          Swal.fire({
            title: "Deleted!",
            text: "Item removed from cart",
            icon: "success",
            showConfirmButton: false,
            timer: 1525,
          });
        }
      });
    } else {
      props.onQtyUpdateClicked(cartItem, -1);
    }
  };

  const handleQtyChange = (event) => {
    _logger({ syntheticEvent: event });
  };

  //#endregion

  //#region START TIME / END TIME / DURATION
  const startTimeString = moment(cartItem?.startTime);
  const endTimeString = moment(cartItem?.endTime);
  const duration = moment
    .duration(endTimeString.diff(startTimeString))
    .asHours();

  const initialValues = {
    // startTime: moment(startTimeString),
    startTime: startTimeString.toDate(),

    // endTime: moment(endTimeString),
    endTime: endTimeString.toDate(),
  };

  const filterPassedTime = (date) => {
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

  //#endregion

  const subTotal =
    (duration * cartItem?.product.hourlyPriceInCents * cartItem?.quantity) /
    100;

  const onLocalDateChange = (event) => {
    _loggersci("onChange: ", event);

    // props.onDateChange(event);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={timeData}
      onChange={onLocalDateChange}
    >
      <Form>
        <Row className="gx-card mx-0 align-items-center border-bottom border-200">
          <Col xs={4} md={3} className="py-3">
            <div className="d-flex align-items-center">
              <Link to="/products">
                <img
                  src={cartItem?.product?.url}
                  width="60"
                  alt={cartItem?.product?.name}
                  className="img-fluid rounded-1 me-3 d-none d-md-block"
                />
              </Link>
              <div className="flex-1">
                <h5 className="fs-0">
                  <Link to="/products" className="text-900">
                    {cartItem?.product?.name}
                  </Link>
                </h5>
                <div className="fs--2 fs-md--1">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger fs--2 fs-md--1 fw-normal p-0"
                    onClick={onRemoveClicked}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={4} md={2} className="ms-7">
            <DatePicker
              className="form-control"
              name="startTime"
              selected={initialValues?.startTime}
              showTimeSelect
              timeIntervals={30}
              filterTime={filterPassedTime}
              minDate={currentDate}
              minTime={minTime}
              maxTime={maxTime}
              dateFormat="EE, M/d  h:mm aa"
              withPortal
              onChange={onLocalDateChange}
            />
            <ErrorMessage
              name="startTime"
              component="div"
              className="transferform-field-error"
            />
          </Col>

          <Col xs={4} md={2} className="ms-6">
            <DatePicker
              className="form-control"
              name="endTime"
              selected={initialValues?.endTime}
              showTimeSelect
              timeIntervals={30}
              filterTime={filterPassedTime}
              minDate={currentDate}
              minTime={minTime}
              maxTime={maxTime}
              dateFormat="EE, M/d  h:mm aa"
              withPortal
            />
            <ErrorMessage
              name="endTime"
              component="div"
              className="transferform-field-error"
            />
          </Col>

          <Col
            md={2}
            xs={{ order: 0 }}
            className="d-flex justify-content-end justify-content-md-center ms-4 me-2"
          >
            <div>
              {cartItem ? (
                <QuantityController
                  quantity={cartItem?.quantity}
                  handleChange={handleQtyChange}
                  handleIncrease={handleIncrease}
                  handleDecrease={handleDecrease}
                  btnClassName="px-2"
                />
              ) : null}
            </div>
          </Col>
          <Col
            md={1}
            xs={{ order: 1 }}
            className="text-end ms-5 ps-0 mb-2 mb-md-0 text-600"
          >
            {`$ ${parseFloat(subTotal).toFixed(2)}`}
          </Col>
        </Row>
      </Form>
    </Formik>
  );
}

ShoppingCartItem.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    startTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date).isRequired,
    ]).isRequired,
    endTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date).isRequired,
    ]).isRequired,
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      productType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      description: PropTypes.string.isRequired,
      standId: PropTypes.number.isRequired,
      identifier: PropTypes.number.isRequired,
      hourlyPriceInCents: PropTypes.number,
      statusType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      hourlyPriceInCents: PropTypes.number.isRequired,
      position: PropTypes.string.isRequired,
      createdBy: PropTypes.number.isRequired,
      modifiedBy: PropTypes.number.isRequired,
      fileId: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    }),
    createdBy: PropTypes.number.isRequired,
    modifiedBy: PropTypes.number.isRequired,
  }),
  index: PropTypes.number.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
  onQtyUpdateClicked: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default ShoppingCartItem;
