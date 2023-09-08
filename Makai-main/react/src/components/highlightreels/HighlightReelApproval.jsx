import React, { useState, useEffect } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import highlightReelService from "services/highlightReelService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import debug from "sabio-debug";
import "./highlightReel.css";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Swal from "sweetalert2";

const _logger = debug.extend("HighlightReelApproval");

const HighlightReelApprovalList = () => {
  const [imageData, setImageData] = useState({
    images: [],
    photoIndex: 0,
    isOpen: false,
    pageIndex: 0,
    pageSize: 8,
    totalCount: 0,
    isApproved: false,
    user: { firstName: "", lastName: "", avatarUrl: "" },
  });

  useEffect(() => {
    fetchUnapprovedReels();
  }, [imageData.pageIndex]);

  const fetchUnapprovedReels = () => {
    highlightReelService
      .getNotApproved(imageData.pageIndex, imageData.pageSize)
      .then(onGetSuccess)
      .catch(onGetError);
  };

  const onGetSuccess = (data) => {
    _logger("this is the data", data.item.pagedItems, setImageData);

    let imagesArray = data.item.pagedItems;

    setImageData((prevState) => {
      let pd = { ...prevState };
      pd.images = imagesArray;
      pd.user = data.item.pagedItems;
      pd.totalCount = data.item.totalCount;
      return pd;
    });
  };

  const onGetError = (error) => {
    _logger("No Images found", error);
    Toastify({
      text: "No Images to Display!",
      className: "Error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  const openLightbox = (photoIndex) => {
    setImageData((prevState) => ({ ...prevState, photoIndex, isOpen: true }));
  };

  const closeLightbox = () => {
    setImageData((prevState) => ({ ...prevState, isOpen: false }));
  };

  const handleApproveClick = (payload) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const axiosPayload = { ...payload, isApproved: true };
        highlightReelService
          .approveImage(axiosPayload)
          .then(() => {
            Toastify({
              text: "Image approved successfully!",
              className: "Success",
              style: {
                background: "green",
              },
            }).showToast();
            fetchUnapprovedReels();
          })
          .catch((error) => {
            _logger("Error approving image", error);
            Toastify({
              text: "Error approving image!",
              className: "Error",
              style: {
                background: "crimson",
              },
            }).showToast();
          });
      }
    });
  };

  const handlePageChange = (newPageIndex) => {
    setImageData((prevState) => ({
      ...prevState,
      pageIndex: newPageIndex - 1,
    }));
  };

  const { images, photoIndex, isOpen, totalCount, pageSize } = imageData;
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <>
      <h1 className="text-center text-white my-4"> Highlight Reel Approval</h1>
      <p id="quote" className="text-center text-white">
        Approve Images Here
      </p>
      <div className=" bg-200 mx-auto fluid row justify-content-between card-body">
        {images.map((responseObj, index) => (
          <div key={index} className="col-sm-6 col-md-3 mb-4 mt-4">
            <div className="card fluid d-block ">
              <div className="media" onClick={() => openLightbox(index)}>
                <p className="card-text text-center">
                  {responseObj.user.firstName} {responseObj.user.lastName}{" "}
                </p>
                <p className="card-text text-center">
                  {" "}
                  {responseObj.user.avatarUrl}{" "}
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    className="card-img-bottom rounded-circle mx-auto image-height"
                    src={responseObj.imageUrl}
                    alt={`Image ${index}`}
                  />
                </div>
              </div>
              <div className="card-footer text-center">
                <button
                  className="btn btn-primary approve-button"
                  onClick={() => handleApproveClick(responseObj)}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex].imageUrl}
          nextSrc={images[(photoIndex + 1) % images.length].imageUrl}
          prevSrc={
            images[(photoIndex + images.length - 1) % images.length].imageUrl
          }
          onCloseRequest={() => closeLightbox()}
          onMovePrevRequest={() =>
            setImageData((prevState) => ({
              ...prevState,
              photoIndex: (photoIndex + images.length - 1) % images.length,
            }))
          }
          onMoveNextRequest={() =>
            setImageData((prevState) => ({
              ...prevState,
              photoIndex: (photoIndex + 1) % images.length,
            }))
          }
        />
      )}
      {images.length > 0 && (
        <Pagination
          className="p-3 d-flex justify-content-center pagination"
          onChange={handlePageChange}
          current={imageData.pageIndex + 1}
          total={imageData.totalCount}
          pageSize={imageData.pageSize}
          pageCount={pageCount}
        />
      )}
    </>
  );
};

export default HighlightReelApprovalList;
