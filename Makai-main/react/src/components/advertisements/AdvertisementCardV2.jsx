import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Col, Button } from "react-bootstrap";
import swal from "sweetalert";
import "./advertisement-v2.css";

function AdvertisementCardV2(props) {
  const anAd = props.advertisement;

  const onEditClicked = () => {
    swal({
      title: "Are you sure you want to edit the details of this advertisement?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "btn-success btn",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "btn-danger btn",
          closeModal: true,
        },
      },
    }).then((willEdit) => {
      if (willEdit) {
        navigateToEditPage();
      } else {
        swal("Edit cancelled...");
      }
    });
  };

  const onDeleteClicked = () => {
    swal({
      title: "Are you sure you want to Delete the advertisement?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "btn-danger btn",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "btn-success btn",
          closeModal: true,
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        deleteAdvertisement();
      } else {
        swal("Delete cancelled...");
      }
    });
  };

  const deleteAdvertisement = () => {
    props.onAdvertisementClicked(props.advertisement);
  };

  const navigate = useNavigate();
  const navigateToEditPage = () => {
    const advertisementState = {
      state: { type: "Advertisement_Edit", payload: anAd },
    };
    navigate(`/advertisements/form/${anAd.id}`, advertisementState);
  };

  const dollars = (cents) => {
    cents /= 100;
    cents.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return cents;
  };

  const [imgSrc, setImgSrc] = useState(anAd.adMainImage);

  const handleError = () =>
    setImgSrc("https://demofree.sirv.com/nope-not-here.jpg");

  return (
    <Col md="4">
      <div className="card advertisement-card border">
        <img
          src={imgSrc}
          className="card-img-top advertisementImage"
          alt="Image Here"
          onError={handleError}
        />
        <div className="advertisement-card-body card-body">
          <h5 className="advertisement-card-title card-title">
            {anAd.product.name}
          </h5>
          <p className="card-text">{anAd.product.description}</p>
        </div>
        <div className="advertisement-card-body2 pb-4">
          <p className="card-text">
            ${dollars(anAd.product.hourlyPriceInCents)} per/Hour
          </p>
          <Button
            href="#"
            className="btn btn-success mx-1"
            onClick={onEditClicked}
          >
            Edit
          </Button>
          <Button
            href="#"
            className="btn btn-danger mx-1"
            onClick={onDeleteClicked}
          >
            Delete
          </Button>
        </div>
      </div>
    </Col>
  );
}

AdvertisementCardV2.propTypes = {
  advertisement: PropTypes.shape({
    id: PropTypes.number,
    adMainImage: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    product: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      hourlyPriceInCents: PropTypes.number.isRequired,
    }),
    dateStart: PropTypes.string.isRequired,
    dateEnd: PropTypes.string.isRequired,
  }),
  onAdvertisementClicked: PropTypes.func,
};

export default AdvertisementCardV2;
