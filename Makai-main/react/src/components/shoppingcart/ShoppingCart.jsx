import React, { useState, useEffect, useCallback } from "react";
import shoppingCartService from "services/shoppingCartService";
import ShoppingCartItem from "./ShoppingCartItem";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import toastr from "toastr";
import Swal from "sweetalert2";
import "./shoppingcart.css";

import debug from "sabio-debug";
const _logger = debug.extend("shoppingCart");

function ShoppingCart() {
  const [cartData, setCartData] = useState({
    cartArray: [],
    cartItemCards: [],
  });

  //#region CALCULATE SUBTOTAL / TOTAL
  const [totalCost, setTotalCost] = useState(0);

  const finalTotal = (cartData) => {
    let total = 0;

    for (let index = 0; index < cartData.cartArray.length; index++) {
      const aCart = cartData.cartArray[index];
      _logger(`${index} product:`, aCart);

      const startTime = moment(aCart.startTime);
      _logger(`${index} startTime:`, startTime);

      const endTime = moment(aCart.endTime);
      const duration = moment.duration(endTime.diff(startTime)).asHours();
      _logger(`${index} duration: `, duration);

      let subTotal =
        (aCart.quantity *
          parseFloat(aCart.product.hourlyPriceInCents).toFixed(2) *
          duration) /
        100;

      _logger(`${index} subTotal: `, subTotal);

      let subTotalFormatted = parseFloat(subTotal.toFixed(2));

      total = total + subTotalFormatted;
    }

    setTotalCost((prevState) => {
      let tot = { ...prevState };
      tot = total;

      return tot;
    });

    _logger("total: =====>", total);
  };

  //#endregion

  useEffect(() => {
    _logger("useEffect firing getCart");
    shoppingCartService.getCart().then(onGetCartSuccess).catch(onGetCartError);
  }, []);

  useEffect(() => {
    finalTotal(cartData);
  }, [cartData.cartArray]);

  const onGetCartSuccess = (response) => {
    _logger(response);
    if (response?.items?.length > 0) {
      let cartDataArray = response.items;

      setCartData((prevState) => {
        const cData = { ...prevState };
        cData.cartArray = cartDataArray;
        cData.cartItemCards = cartDataArray.map(mapCart);

        return cData;
      });
    }
  };

  const onGetCartError = (error) => {
    _logger(error);
    Swal.fire({
      title: "No items in cart",
      showClass: {
        popup: "animate_animated animate_fadeInDown",
      },
      hideClass: {
        popup: "animate_animated animate_fadeOutUp",
      },
    });
  };

  //#region DELETE CART

  const onDeleteRequested = useCallback((cartObj) => {
    _logger("onDeleteRequested firing", { cartObj });

    const handler = getDeleteSuccessHandler(cartObj.id);

    shoppingCartService
      .deleteCartById(cartObj.id)
      .then(handler)
      .catch(onDeleteError);
  }, []);

  const getDeleteSuccessHandler = (idToBeDeleted) => {
    return () => {
      _logger("cart delete in backend successful");

      setCartData((prevState) => {
        const cData = { ...prevState };
        cData.cartArray = [...cData.cartArray];

        //.............LOGIC: TARGET CART IN STATE TO DELETE.............
        const idxOf = cData.cartArray.findIndex((cartElement) => {
          let result = false;

          if (cartElement.id === idToBeDeleted) {
            result = true;
            _logger("targeting cart in frontend to delete: ", idToBeDeleted);
          }
          return result;
        });

        //..................LOGIC: DELETE CART IN STATE..................
        if (idxOf >= 0) {
          cData.cartArray.splice(idxOf, 1);
          cData.cartItemCards = cData.cartArray.map(mapCart);

          _logger("cart delete in frontend successful");
        }

        return cData;
      });
    };
  };

  const onDeleteError = (response) => {
    _logger("onDeleteError", response);
    toastr["error"]("Oops! Unable to delete", "Error");
  };

  //#endregion

  //#region QUANTITY UPDATE CART

  const onQtyUpdateRequested = useCallback((cartObj, value) => {
    _logger("cartObj to change Qty: ", cartObj);
    const newQty = cartObj?.quantity + value;
    _logger("new Qty: ", newQty);

    const payload = {
      productId: cartObj.product.id,
      startTime: cartObj.startTime,
      endTime: cartObj.endTime,
      quantity: newQty,
    };

    const handler = getQtyUpdateSuccessHandler(cartObj, value);

    shoppingCartService
      .updateCartById(cartObj.id, payload)
      .then(handler)
      .catch(onQtyUpdateError);
  }, []);

  const getQtyUpdateSuccessHandler = (aCart, value) => {
    return () => {
      _logger("cart update in backend successful");

      setCartData((prevState) => {
        const cData = { ...prevState };
        cData.cartArray = [...cData.cartArray];

        //.............LOGIC: TARGET CART IN STATE TO UPDATE.............
        const idxOf = cData.cartArray.findIndex((cartElement) => {
          let result = false;

          if (cartElement.id === aCart.id) {
            result = true;
            _logger("targeting cart in frontend to update: ", aCart.id);
          }
          return result;
        });

        //..................LOGIC: UPDATE CART IN STATE..................
        if (idxOf >= 0) {
          _logger("cart in state matches cart whose qty was increased");

          cData.cartArray[idxOf].quantity = aCart.quantity + value;
          _logger("<====> Updated Qty", cData.cartArray[idxOf].quantity);

          cData.cartItemCards = cData.cartArray.map(mapCart);
        }

        return cData;
      });
    };
  };

  const onQtyUpdateError = (response) => {
    _logger("onUpdateError", response);
    toastr["error"]("Oops! Unable to update quantity", "Error");
  };

  //#endregion

  //#region  DATE/TIME UPDATE CART

  const onDateChangeRequested = useCallback((event) => {
    _logger("onChange", event);

    const target = event.target;
    // const fieldValue = target.value;
    const fieldName = target.name;

    _logger(fieldName);
  }, []);

  //#endregion

  //#region MAP CART

  const mapCart = (aCart, index) => {
    _logger(index, "mapCart executing", aCart);

    return (
      <ShoppingCartItem
        key={`Cart_Item_${aCart.id}`}
        cartItem={aCart}
        index={index}
        onDeleteClicked={onDeleteRequested}
        onQtyUpdateClicked={onQtyUpdateRequested}
        onDateChange={onDateChangeRequested}
      />
    );
  };

  //#endregion

  return (
    <React.Fragment>
      <Card>
        <Card.Header>
          <Row className="justify-content-between">
            <Col md="auto">
              <h5 className="mb-3 mb-md-0">
                Shopping Cart ({cartData.cartArray.length} Items)
              </h5>
            </Col>
            <Col md="auto">
              <Button
                as={Link}
                to="/products"
                variant="primary"
                size="sm"
                className="me-2 btn-makai"
              >
                Continue Shopping
              </Button>
              <Button
                as={Link}
                to="/products/stripe/cart"
                variant="primary"
                size="sm"
                className="btn-makai"
              >
                Checkout
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          {cartData.cartArray.length > 0 ? (
            <>
              <Row className="gx-card mx-0 bg-200 text-900 fs--1 fw-semi-bold">
                <Col xs={9} md={3} className="py-2">
                  Name
                </Col>
                <Col xs={3} md={5}>
                  <Row>
                    <Col md={8} className="py-2 d-none d-md-block text-center">
                      Start Time
                    </Col>
                    <Col xs={12} md={3} className="text-end py-2">
                      End Time
                    </Col>
                  </Row>
                </Col>
                <Col md={3} className="py-2 d-none d-md-block text-center">
                  Quantity
                </Col>
                <Col xs={12} md={1} className="text-end py-2">
                  Price
                </Col>
              </Row>

              {cartData.cartItemCards}

              <Row className="fw-bold gx-card mx-0">
                <Col xs={9} md={8} className="py-2 text-end text-900">
                  Total
                </Col>
                <Col className="px-0">
                  <Row className="gx-card mx-0">
                    <Col md={7} className="py-2 d-none d-md-block text-center">
                      {cartData.cartArray.length} (items)
                    </Col>
                    <Col
                      xs={12}
                      md={5}
                      className="text-end py-2 text-nowrap px-x1"
                    >
                      {`$ ${parseFloat(totalCost).toFixed(2)}`}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <p className="p-x1 mb-0 bg-light">
              You have no items in your shopping cart. Go ahead and start
              shopping!
            </p>
          )}
        </Card.Body>

        {cartData.cartArray.length > 0 && (
          <Card.Footer className="bg-light d-flex justify-content-end">
            <Button
              as={Link}
              to="products/stripe/cart/checkout"
              variant="primary"
              size="sm"
              className="btn btn-makai"
            >
              Checkout
            </Button>
          </Card.Footer>
        )}
      </Card>
    </React.Fragment>
  );
}
export default ShoppingCart;
