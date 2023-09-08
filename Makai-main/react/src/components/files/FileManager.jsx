import React, { useState, useEffect } from "react";
import * as fileService from "../../services/fileService";
import FileTable from "./FileTable";
import PropTypes from "prop-types";
import FileSearch from "./FileSearch";
import FileCheckBox from "./FileCheckBox";
import { Container, Row, Col } from "react-bootstrap";
import locale from "rc-pagination/lib/locale/en_US";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import toastr from "toastr";

function FileManager() {
  //#region STATE
  const [fileData, setFileData] = useState({
    arrayOfFiles: [],
    showDeleted: false,
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fileService
      .getByDeleted(fileData.pageIndex, fileData.pageSize, fileData.showDeleted)
      .then(onGetAllSuccess)
      .catch(onGetAllFail);
  }, [fileData.pageIndex]);

  const onGetAllSuccess = (response) => {
    const theFiles = response.item?.pagedItems;

    setFileData((prevState) => {
      const fd = { ...prevState };
      fd.arrayOfFiles = theFiles;
      fd.totalCount = response?.item?.totalCount;
      fd.totalPages = response?.item?.totalCount;
      fd.showDeleted = false;
      return fd;
    });
  };

  const onGetAllFail = () => {
    toastr.error("Failed to get files");
  };
  //#endregion

  //#region PAGINATION
  const onPaginationChange = (page) => {
    setFileData((prevState) => {
      const newObject = { ...prevState };
      newObject.pageIndex = page - 1;
      return newObject;
    });
  };
  //#endregion

  //#region SEARCH BY QUERY
  const onFileSearched = (searchItem) => {
    fileService
      .searchFilesByQuery(fileData.pageIndex, fileData.pageSize, searchItem)
      .then(onFileSearchSuccess)
      .catch(onFileSearchFail);
  };

  const onFileSearchSuccess = (response) => {
    setFileData((prevState) => {
      const searchedFiles = { ...prevState };
      searchedFiles.arrayOfFiles = response.item.pagedItems;
      searchedFiles.totalCount = response.item.totalCount;
      searchedFiles.totalPages = response.item.totalPages;
      return searchedFiles;
    });
  };

  const onFileSearchFail = () => {
    toastr.error("Failed to find files");
  };
  //#endregion

  //#region DELETE add call back
  const onDeleteClickHandler = (deleteClickFile) => {
    fileService
      .deleteFile(deleteClickFile.id)
      .then(onDeleteSuccess(deleteClickFile.id))
      .catch(onDeleteFail);
  };

  const onDeleteSuccess = (deleteId) => {
    setFileData((prevState) => {
      const fd = { ...prevState };
      fd.arrayOfFiles = [...fd.arrayOfFiles];

      const indexOf = fd.arrayOfFiles.findIndex((file) => {
        let result = false;
        if (file.id === deleteId) {
          result = true;
        }
        return result;
      });

      if (indexOf >= 0) {
        fd.arrayOfFiles.splice(indexOf, 1);
      }

      return fd;
    });
  };

  const onDeleteFail = () => {
    toastr.error("Failed to delete file");
  };
  //#endregion

  //#region FILTERS
  const onFiltersApplied = (filterByArray) => {
    const fileIdArray = [];
    for (let i = 0; i <= filterByArray.length; i++) {
      if (filterByArray[i]) {
        let parsedFileType = parseInt(filterByArray[i]);
        fileIdArray.push(parsedFileType);
      }
    }

    const filterPayload = {
      pageIndex: fileData.pageIndex,
      pageSize: fileData.pageSize,
      fileTypes: fileIdArray,
    };

    fileService
      .filterFiles(filterPayload)
      .then(onFilterFilesSuccess)
      .catch(onFilterFilesFail);
  };

  const onFilterFilesSuccess = (response) => {
    toastr.success("Obtained filtered files");
    const filteredFiles = response?.item?.pagedItems;
    setFileData((prevState) => {
      const fd = { ...prevState };
      fd.arrayOfFiles = filteredFiles;
      fd.totalCount = response.item.totalCount;
      fd.totalPages = response.item.totalPages;
      return fd;
    });
  };

  const onFilterFilesFail = () => {
    toastr.error("Failed to filter files");
  };
  //#endregion

  //#region SHOW DELETE HANDLER
  const onShowDelete = () => {
    fileService
      .getByDeleted(fileData.pageIndex, fileData.pageSize, true)
      .then(onGetByDeletedSuccess)
      .catch(onGetByDeletedFail);
  };

  const onGetByDeletedSuccess = (response) => {
    setFileData((prevState) => {
      const fd = { ...prevState };
      fd.arrayOfFiles = response.item.pagedItems;
      if (!prevState.showDeleted) {
        fd.showDeleted = !prevState.showDeleted;
      }
      fd.totalCount = response.item.totalCount;
      fd.totalPages = response.item.totalPages;
      return fd;
    });
  };

  const onGetByDeletedFail = () => {
    toastr.error("Failed to display deleted files");
  };
  //#endregion

  //#region SHOW ALL HANDLER
  const onShowAllClick = () => {
    fileService
      .getByDeleted(fileData.pageIndex, fileData.pageSize, false)
      .then(onGetAllSuccess)
      .catch(onGetAllFail);
  };
  //#endregion

  //#region RECOVER FILE
  const onRecoverFile = (recoverFile) => {
    fileService
      .recoverFile(recoverFile.id)
      .then(onRecoverFileSuccess(recoverFile.id))
      .catch(onRecoverFileFail);
  };

  const onRecoverFileSuccess = (recoverId) => {
    setFileData((prevState) => {
      const fd = { ...prevState };
      fd.arrayOfFiles = [...fd.arrayOfFiles];

      const indexOf = fd.arrayOfFiles.findIndex((file) => {
        let result = false;
        if (file.id === recoverId) {
          result = true;
        }
        return result;
      });

      if (indexOf >= 0) {
        fd.arrayOfFiles.splice(indexOf, 1);
      }

      return fd;
    });
  };

  const onRecoverFileFail = () => {
    toastr.error("Failed to recover file");
  };
  //#endregion

  return (
    <React.Fragment>
      <Container className="align-left pt-7">
        <Row>
          <Col lg={9}>
            <FileTable
              tableList={fileData.arrayOfFiles}
              isShowDeleted={fileData.showDeleted}
              tableDeleteHandler={onDeleteClickHandler}
              recoverHandler={onRecoverFile}
            />
          </Col>
          <Col lg={3}>
            <div className="text-center p-2 align-left bg-white rounded mt-3">
              <FileSearch searchHandler={onFileSearched} />
              <FileCheckBox
                filterHandler={onFiltersApplied}
                showDeleteHandler={onShowDelete}
                showAllHandler={onShowAllClick}
              />
            </div>
          </Col>
          <Row className="ms-9">
            <Pagination
              className="ms-10"
              onChange={onPaginationChange}
              pageSize={fileData.pageSize}
              current={fileData.pageIndex + 1}
              total={fileData.totalCount}
              hideOnSinglePage={false}
              locale={locale}
            />
          </Row>
        </Row>
      </Container>
    </React.Fragment>
  );
}

FileManager.propTypes = {
  tableList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
      fileType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      createdBy: PropTypes.number,
    }).isRequired
  ),
};

export default FileManager;
