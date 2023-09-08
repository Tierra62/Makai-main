import React from "react";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import debug from "sabio-debug";
import * as fileService from "services/fileService";
import toastr from "toastr";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import "../components/partners/partnercard.css";

function FileUploader(props) {
  const [fileList, setFileList] = useState();
  const _logger = debug.extend("Files");
  const [displayedFiles, setDisplayedFiles] = useState([]);

  false && _logger(fileList, setFileList, props);

  useEffect(() => {
    if (fileList?.length > 0) {
      setDisplayedFiles(fileList.map(fileMapper));
    }
  }, [fileList]);

  const onDrop = (acceptedFiles) => {
    let formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });
    _logger(formData);

    fileService
      .uploadFiles(formData)
      .then(onUploadFilesSuccess)
      .catch(onUploadFilesFail);
  };

  const fileMapper = (file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  );

  const onUploadFilesSuccess = (res) => {
    if (res && props.onUploadSuccess) {
      props.onUploadSuccess(res);
      _logger("file uploaded");
      toastr.success("file uploaded");
    }
  };
  const onUploadFilesFail = (err) => {
    _logger("failed to upload file", err);
    toastr.error("file failed to upload");
  };

  return (
    <>
      {" "}
      <Container className={props.className || "mt-5 w-50 mb-5 pt-6"}>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="text-center card border border-info pb-5"
            >
              <input {...getInputProps()} />
              <p className="mx-auto pt-6 pb-3 fw-bolder" style={{}}>
                Drag and drop some files here, or click to select files
              </p>
              <img
                className="file-icon"
                src="https://cdn-icons-png.flaticon.com/512/564/564793.png"
              />
            </div>
          )}
        </Dropzone>
      </Container>
      <aside>
        <ul>{displayedFiles}</ul>
      </aside>
    </>
  );
}

FileUploader.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
  className: PropTypes.string,
};
export default FileUploader;
