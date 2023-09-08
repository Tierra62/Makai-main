import React, { useCallback, useRef } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import debug from "sabio-debug";
import { uploadFiles } from "services/fileService";
import PropTypes from "prop-types";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const _logger = debug.extend("Camera");

function Camera({ onUploadSuccess }) {
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    Swal.fire({
      imageUrl: imageSrc,
      title: "Do you want to upload this image?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Upload",
      denyButtonText: `Retake Photo`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Uploaded!", "", "success");
        uploadScreenshot(imageSrc);
      } else if (result.isDenied) {
        Swal.fire("Deleted Photo");
      }
    });
  }, [webcamRef]);

  const uploadScreenshot = (base64file) => {
    const file = DataURIToBlob(base64file);
    const formData = new FormData();

    formData.append("files", file, "screenshot.jpg");

    _logger("screenshot exists, uploading...");

    uploadFiles(formData).then(onUploadFileSuccess).catch(onUploadFileError);
  };

  const onUploadFileSuccess = (response) => {
    _logger(response);
    const image = response.items[0].url;
    onUploadSuccess(image);
  };

  const onUploadFileError = (error) => {
    _logger(error);
    Toastify({
      text: "Please Take Picture again.",
      className: "error",
      style: {
        background: "red",
      },
      duration: 2000,
    }).showToast();
  };

  const DataURIToBlob = (data) => {
    const splitData = data.split(",");
    const byteString =
      splitData[0].indexOf("base64") >= 0
        ? atob(splitData[1])
        : decodeURI(splitData[1]);
    const mimeString = splitData[0].split(":")[1].split(";")[0];

    const intArray = new Uint8Array(byteString.length);
    for (let i = 0; i < intArray.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: mimeString });
  };

  return (
    <div className="Container">
      <>
        <Webcam
          audio={false}
          mirrored={true}
          height={400}
          width={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <button
          className="btn btn-primary"
          data-page="/standreturns"
          onClick={capture}
        >
          Capture photo
        </button>
      </>
    </div>
  );
}

Camera.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default Camera;
