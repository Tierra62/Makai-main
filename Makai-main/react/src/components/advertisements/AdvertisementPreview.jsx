import React from "react";
import PropTypes from "prop-types";
import MakaiLogo from "../../assets/img/logos/Makai.png";
import "./Advertisement.css";
function AdvertisementPreview(props) {
  const aAd = props.advertisement;

  return (
    <div className="row ">
      <div className="advertisement-card">
        <img
          className="img-fluid rounded-circle advertisementCard-rounded-circle mx-auto"
          src={aAd.adMainImage ? aAd.adMainImage : MakaiLogo}
          alt={"No Image to display"}
        ></img>
        <div className="card-body-preview">
          <h3 className="card-title-preview"> {aAd.product}</h3>
          <h5 className="card-text-preview">{aAd.title}</h5>
          <p className="card-text2-preview">{aAd.details}</p>
          <div></div>
        </div>
      </div>
    </div>
  );
}
AdvertisementPreview.propTypes = {
  advertisement: PropTypes.shape({
    adMainImage: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    product: PropTypes.string,
  }),
};

export default AdvertisementPreview;
