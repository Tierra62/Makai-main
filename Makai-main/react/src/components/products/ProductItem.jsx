import React, { useEffect, useState } from "react";
import debug from "sabio-debug";
import Review from "../reviews/Review";
import { useLocation, useNavigate } from "react-router-dom";
import "./productitem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import ReviewList from "../reviews/ReviewList";
import reviewService from "services/reviewService";
import Swal from "sweetalert2";
import toastr from "toastr";
import Ratings from "components/ratings/Ratings";
import ratingsService from "services/ratingsService";
import { IoIosHeart } from "react-icons/io";

const { entityTypes } = ratingsService;

const ProductItem = () => {
  const _logger = debug.extend("ProductItem.jsx");
  _logger("In product item");

  const { state } = useLocation();
  const [refresher, setRefresher] = useState(false);

  const [product, setProduct] = useState({
    id: 0,
    name: "",
    productType: {
      name: "",
    },
    description: "",
    hourlyPriceInCents: 0,
    statusType: {
      name: "",
    },
    url: "",
  });

  const [editReview, setReview] = useState({
    id: 0,
    subject: "",
    text: "",
    isDelete: false,
    entityId: product.id,
    user: {
      id: 0,
      firstName: "",
      lastName: "",
      mi: "",
      avatarUrl: "",
    },
  });

  const [showReview, setShowReview] = useState(true);
  const [key, setKey] = useState(1);

  const [favorite, setFavorite] = useState({ show: true });

  const onSentSuccess = () => {
    _logger("sent by navigate: ", state.payload);
    const newProduct = { ...state.payload };
    setProduct(() => {
      let pd = {};
      pd = { ...newProduct };
      return pd;
    });
    setKey(key + 1);
  };

  useEffect(() => {
    if (state) {
      _logger("state: ", state);
      if (state.payload !== null) {
        onSentSuccess();
      }
    }
  }, [refresher]);

  const navigate = useNavigate();
  function onBackClick() {
    navigate(`/products`);
  }

  const handleUpdate = () => {
    _logger("handleUpdate", refresher);
    setRefresher((previous) => {
      const pd = !previous;
      return pd;
    });
    _logger("handleUpdate new", refresher);
    setShowReview(false);
  };

  const handleReview = () => {
    _logger("In handleReview");
    setShowReview(false);
    _logger("Current value:", showReview);
  };

  const handleEdit = (review) => {
    _logger("Edit clicked");
    setReview(() => {
      const pd = { ...review };
      return pd;
    });
    setShowReview(true);
  };

  const handleDelete = (review) => {
    _logger("Delete clicked", review);
    Swal.fire({
      title: "WARNING!",
      text: "Do you really want to delete your review?",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        reviewService
          .deleteReview(review.id)
          .then(onDeleteSuccess)
          .catch(onDeleteError);
      }
    });
  };

  const onDeleteSuccess = (data) => {
    _logger("Delete Success", data);
    setKey(key + 1);
    setShowReview(true);
    setReview(() => {
      const pd = {
        id: 0,
        subject: "",
        text: "",
        isDelete: false,
        entityId: product.id,
        user: {
          id: 0,
          firstName: "",
          lastName: "",
          mi: "",
          avatarUrl: "",
        },
      };
      return pd;
    });
  };

  const onDeleteError = (error) => {
    _logger("Delete Error", error);
    toastr["error"]("There was a problem deleting", "error");
  };

  const clickFavorite = (value) => {
    setFavorite({ show: value });
  };

  return (
    <div className="container">
      <button className="btn product-back-button" onClick={onBackClick}>
        Go Back
      </button>
      <div className="card makai-background-2">
        <div className="card text-light makai-background-1">
          <div className="card-body">
            <div className="row row-cols-2 g-3 justify-content-evenly pb-3">
              <div className="col align-self-center card-for-individual-cards">
                <div className="d-flex justify-content-center">
                  <img
                    src={product.url}
                    alt="product of choice"
                    className="card-image-for-individual-cards img-fluid rounded border border-3 border-secondary"
                  />
                </div>
              </div>
              <div className="col d-flex justify-content-start flex-column card-for-individual-cards">
                <div className="row">
                  <h2 className="text-light">{product.name}</h2>
                </div>
                <div className="row d-flex flex-column">
                  <div className="col">
                    <a className="text-secondary">{product.productType.name}</a>
                  </div>
                  <div className="col ratings-push">
                    <Ratings
                      entity={{
                        entityId: product.id,
                        entityTypeId: entityTypes.product,
                      }}
                      size="small"
                    />
                  </div>
                </div>
                <hr />
                <span>{product.description}</span>
                <hr />
                <div className="row">
                  <div className="col">
                    <p className="text-warning">{`Rental Price: $${Number.parseFloat(
                      product.hourlyPriceInCents / 100
                    ).toFixed(2)} / HR`}</p>
                    <p>
                      Stock:{" "}
                      <strong>
                        {product.statusType.id === 1
                          ? "Available"
                          : "Stock-Out"}
                      </strong>
                    </p>

                    <button className="btn btn-primary me-3">
                      <FontAwesomeIcon icon={faCartPlus} className="me-sm-2" />
                      Add To Cart
                    </button>
                    {favorite.show ? (
                      <button
                        type="button"
                        className="me-3 btn btn-falcon-default favorites"
                        onClick={() => clickFavorite(false)}
                      >
                        <IoIosHeart />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="me-3 btn btn-falcon-default unfavorites"
                        onClick={() => clickFavorite(true)}
                      >
                        <IoIosHeart className="favorites-heart" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {showReview ? (
              <div>
                <hr></hr>
                <div className="row justify-content-center">
                  <div className="col align-self-center">
                    <Review
                      entityId={product.id}
                      updater={handleUpdate}
                      editReview={editReview}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="row justify-content-center">
              <div className="col">
                <ReviewList
                  key={key}
                  entityId={product.id}
                  handleEdit={handleEdit}
                  handleReview={handleReview}
                  isRefresh={refresher}
                  handleDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductItem;
