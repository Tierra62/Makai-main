import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import highlightReelService from "services/highlightReelService";
import { Carousel } from "react-bootstrap";
import "./highlightReel.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
const _logger = debug.extend("HighlightReelCarousel");

function HighlightReelCarousel() {
  const [carouselData, updateCarouselData] = useState({
    carouselItemsComponent: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    isApproved: true,
  });
  _logger(carouselData);

  useEffect(() => {
    highlightReelService
      .getApproved(carouselData.pageIndex, carouselData.pageSize)
      .then(onGetSuccess)
      .catch(onGetError);
  }, []);

  const onGetSuccess = (data) => {
    _logger(data.item.pagedItems, updateCarouselData);

    let imagesArray = data.item.pagedItems;
    updateCarouselData((prevState) => {
      let pd = { ...prevState };
      pd.pagedData = imagesArray;
      pd.carouselItemsComponent = imagesArray.map(MapResponseObjToImage);
      return pd;
    });
  };

  const onGetError = (error) => {
    _logger("Could not find images", error);
    Toastify({
      text: "Images not found",
      className: "Error",
      style: {
        background: "crimson",
      },
      duration: 1500,
      close: true,
    }).showToast();
  };

  const MapResponseObjToImage = (responseObj) => {
    return (
      <Carousel.Item key={responseObj.id}>
        <img
          className="d-block w-100 reels-carousel-image"
          src={responseObj.imageUrl}
          alt={responseObj.description}
        />
      </Carousel.Item>
    );
  };
  return (
    <>
      <div className="pb-5">
        <h1 className="text-center text-white py-3">
          Check out some of our Satisfied Customers{" "}
        </h1>
        <Carousel fade interval={2000}>
          {carouselData.carouselItemsComponent}
        </Carousel>
      </div>
    </>
  );
}

export default HighlightReelCarousel;
