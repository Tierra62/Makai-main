import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import "./Advertisement.css";

function AdvertisementCard(props) {
  const aAd = props.advertisement;

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
      state: { type: "Advertisement_Edit", payload: aAd },
    };
    navigate(`/advertisements/form/${aAd.id}`, advertisementState);
  };

  return (
    <div className="row ">
      <div className="advertisement-card" style={{ width: 300 }}>
        <img
          className="img-fluid rounded-circle advertisementCard-rounded-circle mx-auto"
          src={
            aAd.adMainImage
              ? aAd.adMainImage
              : "https://trello.com/1/cards/63f55215ac3814bd7bf15df0/attachments/63f55215ac3814bd7bf15e8e/download/Makai_Rentals_Logo_Blue_No_Background.png"
          }
          alt={"No Image to display"}
        ></img>
        <div className="card-body">
          <h3 className="card-title"> {aAd.product.name}</h3>
          <h5 className="card-text">{aAd.title}</h5>
          <p className="card-text2">{aAd.details}</p>
          <div className="card-footer">
            <button
              href="#"
              className="btn btn-danger ml-5 mb-5"
              onClick={onDeleteClicked}
            >
              Delete
            </button>
            <button
              href="#"
              className="btn btn-info ml-5 mb-5"
              onClick={onEditClicked}
            >
              Edit
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

AdvertisementCard.propTypes = {
  advertisement: PropTypes.shape({
    id: PropTypes.int,
    adMainImage: PropTypes.string,
    title: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    product: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    dateStart: PropTypes.string.isRequired,
    dateEnd: PropTypes.string.isRequired,
  }),
  onAdvertisementClicked: PropTypes.func,
};

export default AdvertisementCard;
