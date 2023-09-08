import React, { useState } from "react";
import * as fileService from "services/fileService";
import Flex from "components/common/Flex";
import cloudUpload from "assets/img/icons/cloud-upload.svg";
import PropTypes from "prop-types";
import debug from "sabio-debug";
const _logger = debug.extend("profile");
import Swal from "sweetalert2";
import userService from "services/userService";
import "./profile.css";

const ProfileImageUploader = ({ onImageUpload }) => {
  const [image, setImage] = useState({});
  const [formData, setFormData] = useState({});

  const onUploadImage = (e) => {
    const acceptedFiles = e.target.files;
    let formData = new FormData();

    for (let i = 0; i < acceptedFiles.length; i++) {
      formData.append("files", acceptedFiles[i]);
    }
    fileService
      .uploadFiles(formData)
      .then(onUploadFilesSuccess)
      .catch(onUploadFilesFail);
  };

  const AlertError = () => {
    Swal.fire(
      "Something went wrong!",
      "Click button again to revert back.",
      "error"
    );
  };

  const Alert = () => {
    Swal.fire(
      "Profile upload Successful!",
      "Click button again to revert back.",
      "success"
    );
  };
  const onUploadFilesSuccess = (res) => {
    _logger("res", res);
    _logger("formData", formData);
    if (res && res.items && res.items.length > 0) {
      const imageUrl = res.items[0].url;

      setFormData((prevState) => {
        const newData = { ...prevState };
        newData.avatarUrl = imageUrl;
        _logger("newdata", newData.avatarUrl);
        userService
          .onUpdateUser(newData.id, newData)
          .then((success) => {
            _logger("Success updating user profile image URL:", success);
          })
          .catch((error) => {
            _logger("Error updating user profile image URL:", error);
          });

        return newData;
      });

      setImage(imageUrl);
      onImageUpload(imageUrl);
      Alert();
    }
  };

  const onUploadFilesFail = (err) => {
    _logger("failed to upload file", err);
    AlertError();
    ("file failed to upload");
  };

  return (
    <div className="dropzone-area profile-image-uploader">
      <input
        onChange={onUploadImage}
        type="file"
        className="profile-file-input"
      />
      <Flex justifyContent="center">
        {image ? (
          <img src={image} alt="" width={50} />
        ) : (
          <>
            <img src={cloudUpload} alt="" width={25} className="me-2" />
            <p className="fs-0 mb-0 text-700 text-center text-white">Upload</p>
          </>
        )}
      </Flex>
    </div>
  );
};

ProfileImageUploader.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
};

export default ProfileImageUploader;
