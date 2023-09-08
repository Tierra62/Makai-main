import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import "./SiteTraining.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toastr from "toastr";
import siteTrainingService from "services/siteTrainingService";
import SiteTrainingCard from "./SiteTrainingCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import lookUpService from "services/lookUpService";
import { Button } from "react-bootstrap";

const _logger = debug.extend("training");

function TrainingList(props) {
  const [searchData, setSearchData] = useState({
    query: "",
    arrayOfSearch: [],
  });
  const [pageData, setPageData] = useState({
    trainingList: [],
    trainingComponents: [],
    currentPage: 1,
    pageIndex: 0,
    pageSize: 6,
    totalCount: 0,
    categoryId: 0,
    arrayOfCategory: [],
    isDeleted: false,
  });

  const AlertError = () => {
    Swal.fire(
      "Something went wrong!",
      "Click button again to revert back.",
      "error"
    );
  };

  const mapTraining = (aTraining) => {
    return (
      <SiteTrainingCard
        training={aTraining}
        key={aTraining.id}
        onTrainingClicked={onDeleteRequested}
        {...props}
      />
    );
  };

  const onDeleteRequested = useCallback((remove) => {
    const handler = deleteSuccess(remove.id);
    siteTrainingService
      .onDeleteById(remove.id)
      .then(handler)
      .catch(onDeleteError);
  }, []);
  const deleteSuccess = (idToBeDeleted) => {
    return () => {
      toastr.success("Deleted training record");
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.trainingList = [...prevState.trainingList];
        const indexOf = pd.trainingList.findIndex((remove) => {
          let result = false;
          if (remove.id === idToBeDeleted) {
            result = true;
          }
          return result;
        });
        _logger("index of in deletesuccess", indexOf);
        if (indexOf >= 0) {
          _logger("pd before splice", pd);
          pd.trainingList.splice(indexOf, 1);
          pd.trainingComponents = pd.trainingList.map(mapTraining);
        }
        return pd;
      });
    };
  };

  const onDeleteError = () => {
    toastr.error(" Could not delete training record");
  };

  useEffect(() => {
    if (!searchData.query) {
      if (!pageData.categoryId) {
        siteTrainingService
          .trainingGetAll(
            pageData.pageIndex,
            pageData.pageSize,
            pageData.isDeleted,
            props.currentUser.id
          )
          .then(onGetTrainingsSuccess)
          .catch(onGetTrainingsError);
      } else {
        siteTrainingService
          .getByCategoryId(
            pageData.pageIndex,
            pageData.pageSize,
            pageData.categoryId,
            pageData.isDeleted
          )
          .then(onGetTrainingsSuccess)
          .catch(onGetCategoriesError);
      }
    } else {
      siteTrainingService
        .search(
          pageData.pageIndex,
          pageData.pageSize,
          searchData.query,
          pageData.isDeleted
        )
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  }, [
    pageData.pageIndex,
    pageData.pageSize,
    searchData.query,
    pageData.categoryId,
    pageData.isDeleted,
    props.currentUser.id,
  ]);

  const onGetTrainingsSuccess = (response) => {
    setPageData((prevState) => {
      const newList = { ...prevState };
      newList.trainingList = response.item.pagedItems;
      _logger(response);
      newList.trainingComponents = newList.trainingList.map(mapTraining);
      newList.totalCount = response.item.totalCount;
      return newList;
    });
  };

  const onGetTrainingsError = (error) => {
    _logger(error);
    AlertError();
  };

  const onGetCategoriesError = (error) => {
    _logger(error);
    toastr.error(
      "There are no trainings for this actegory please choose a different category."
    );
  };

  const onSearchSuccess = (response) => {
    _logger(response);
    let searchedArray = response.data.item.pagedItems;
    setPageData((prevState) => {
      const newList = { ...prevState };
      newList.arrayOfSearch = searchedArray;
      newList.trainingComponents = searchedArray.map(mapTraining);
      newList.totalCount = response.data.item.totalCount;
      newList.totalPages = response.data.item.totalPages;
      return newList;
    });
  };

  const onSearchError = (error) => {
    _logger({ error });
    toastr.error("Could not find word, try again");
  };

  const onFormFieldChange = (search) => {
    _logger(search);
    const newUserValue = search.target.value;
    setSearchData((prevState) => {
      const newUserObject = { ...prevState };
      newUserObject.query = newUserValue;
      return newUserObject;
    });
  };

  const onChangePage = (page) => {
    setPageData((prevState) => {
      const newList = { ...prevState };
      newList.pageIndex = page - 1;
      newList.currentPage = page;
      return newList;
    });
  };

  const [trainings, setTrainings] = useState({
    trainingsMapped: [],
  });

  useEffect(() => {
    lookUpService
      .LookUp(["TrainingCategories"])
      .then(onGetLookUpSuccess)
      .catch(onGetLookUpError);
  }, []);

  const onGetLookUpSuccess = (data) => {
    let training = data.item.trainingCategories;
    setTrainings((prevState) => {
      let pd = { ...prevState };
      pd.trainingsMapped = training.map(mapFromLookUp);
      return pd;
    });
  };

  const onGetLookUpError = (error) => {
    _logger("Error on lookup Service", error);
    toastr.error("Your Category topics could not be found");
  };

  const mapFromLookUp = (training) => {
    return (
      <option key={training.id} value={training.id}>
        {training.name}
      </option>
    );
  };

  const selectCategory = (categorySelect) => {
    _logger(categorySelect);
    const selectedId = categorySelect.target.value;
    setPageData((prevState) => {
      const categoryObject = { ...prevState };
      categoryObject.categoryId = selectedId;
      return categoryObject;
    });
  };

  return (
    <React.Fragment>
      <div className="training-container-list">
        <div className="mb-3 training-list-card">
          <div className="training-list-body">
            <div className="flex-between-center row">
              <div className="col-sm-auto">
                <div className="gx-2 align-items-center row">
                  <div className="col-auto">
                    <div className="gx-2 row">
                      <h3 className="mt-3 Header"> Trainings List</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center mb-2 mb-sm-0 col-sm-auto">
                <select
                  className="pe-5 form-select"
                  value={pageData.categoryId}
                  onChange={selectCategory}
                >
                  <option value={""}>
                    {pageData.categoryId === 0
                      ? "Filter by Category"
                      : "Show all Categories"}
                  </option>
                  {trainings.trainingsMapped}
                </select>
              </div>
              <div className="d-flex align-items-center mb-2 mb-sm-0 col-sm-auto">
                <input
                  className="form-control training-search me-2 w-100"
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  name="query"
                  value={searchData.query}
                  onChange={onFormFieldChange}
                />
              </div>
            </div>
          </div>
          {props.currentUser.roles.includes("Admin") ? (
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Add new Training</Tooltip>}
            >
              <Link to="/training/form">
                {" "}
                <Button className="training-list-icongrid">
                  Add new Training{" "}
                  <FontAwesomeIcon
                    icon={faFileCirclePlus}
                    className=" iconlist new-training-icon "
                  />
                </Button>
              </Link>
            </OverlayTrigger>
          ) : (
            ""
          )}
          <Pagination
            onChange={onChangePage}
            current={pageData.currentPage}
            pageSize={pageData.pageSize}
            total={pageData.totalCount}
            className="d-flex justify-content-center my-3"
            locale={locale}
          />
        </div>

        <div className="training-row">
          <div className="col-md-12">
            <div className="training-list-display d-flex flex-wrap align-items-center justify-content-center">
              {pageData.trainingComponents}
            </div>
            <div className=" align-items-center training-pagination-bottom ">
              <Pagination
                onChange={onChangePage}
                current={pageData.currentPage}
                pageSize={pageData.pageSize}
                total={pageData.totalCount}
                className="d-flex justify-content-center my-3"
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

TrainingList.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.int,
    roles: PropTypes.string,
  }),
};

export default TrainingList;
