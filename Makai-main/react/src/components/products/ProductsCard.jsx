import React, { useState } from "react";
import PropTypes from "prop-types";
import { IoIosHeart, IoIosCart } from "react-icons/io";
import "./productscard.css";
import { useNavigate } from "react-router-dom";
import Ratings from "components/ratings/Ratings";
import ratingsService from "services/ratingsService";
import debug from "sabio-debug";
const _logger = debug.extend("Products.jsx");

const { entityTypes } = ratingsService;

function ProductsCard(props) {
  const [button, setButton] = useState({ show: true });

  const price = props.product.hourlyPriceInCents;
  const dollars = (price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const displayPrice = price > 0 ? `Price per hour: ${dollars}` : "";
  const onLocalFaveClicked = (e) => {
    e.preventDefault();
    props.onFaveClicked(props.product.id);
    _logger(props.product.id);
    setButton((prevState) => {
      const button = { ...prevState };
      if (button.show) {
        button.show = false;
      } else {
        button.show = true;
      }
      return button;
    });
  };

  const onLocalUnfaveClicked = (e) => {
    e.preventDefault();
    props.onUnfaveClicked(props.product.id);
    setButton((prevState) => {
      const button = { ...prevState };
      if (button.show) {
        button.show = true;
      } else {
        button.show = true;
      }
      return button;
    });
  };

  function onShoppingCartClick() {
    props.onCartClick(props.product);
  }

  const navigate = useNavigate();

  function onProductClick() {
    const targetPage = `/product/${props.product.id}`;
    const stateForTransports = { type: "PRODUCT_VIEW", payload: props.product };
    navigate(targetPage, { state: stateForTransports });
  }

  return (
    <div className="mb-2 col-lg-3 col-md-6">
      <div className="d-flex flex-column justify-content-between border rounded-1 h-100 pb-2">
        <div className="overflow-hidden">
          <div className="position-relative rounded-top overflow-hidden">
            <a
              className="d-flex justify-content-center"
              href=""
              onClick={price > 0 ? onProductClick : " "}
            >
              <img
                src={props.product.url}
                alt="product of choice"
                className="rounded-top card-image-for-products-card"
              />
            </a>
          </div>
          <div className="p-3">
            <h5 className="fs-0">
              <a
                className="text-dark"
                href=""
                onClick={price > 0 ? onProductClick : " "}
              >
                {props.product.name}
              </a>
            </h5>
            <p className="fs--1 mb-3">
              <a className="text-500" href="/e-commerce/product/product-grid#!">
                {props.product.productType.name}
              </a>
            </p>
            <h5 className="fs-md-2 text-warning mb-0 d-flex align-items-center mb-3">
              {displayPrice}
            </h5>
          </div>
        </div>
        <div className="d-flex align-items-center px-3 ">
          <div className="flex-1 product-card-bottom">
            <span className="ms-1">
              <Ratings
                entity={{
                  entityId: props.product.id,
                  entityTypeId: entityTypes.product,
                }}
                size={"small"}
              />
            </span>
          </div>
          {props.currentUser.roles.includes("User") ? (
            <div>
              {button.show && props.product.isFavorite === true ? (
                <button
                  type="button"
                  className="me-2 btn btn-falcon-default btn-sm favorites"
                  onClick={onLocalFaveClicked}
                >
                  <IoIosHeart className="favorites-heart" />
                </button>
              ) : (
                <button
                  type="button"
                  className="me-2 btn btn-falcon-default btn-sm unfavorites"
                  onClick={onLocalUnfaveClicked}
                >
                  <IoIosHeart className="favorites-unheart" />
                </button>
              )}
            </div>
          ) : (
            ""
          )}
          <button
            onClick={onShoppingCartClick}
            type="button"
            className="btn btn-falcon-default btn-sm shopping-cart"
          >
            + <IoIosCart />
          </button>
        </div>
      </div>
    </div>
  );
}

ProductsCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    productType: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    hourlyPriceInCents: PropTypes.number.isRequired,
    statusType: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    url: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }),
  onFaveClicked: PropTypes.func.isRequired,
  onUnfaveClicked: PropTypes.func.isRequired,
  onCartClick: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};
export default ProductsCard;
