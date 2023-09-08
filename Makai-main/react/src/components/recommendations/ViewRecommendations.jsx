import React, { useCallback } from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import recommendationsService from "services/recommendationsService";
import RecommendationsTableRow from "./RecommendationsTableRow";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const _logger = debug.extend("ViewRecomm", locale);

function ViewRecommendations() {
  //-------------------------------------------------state-------------------------------------------------------//
  const [recommendationsState, setRecommendationsState] = useState({
    recommendations: [],
    mappedRecommendations: [],
    totalNumRecommendations: 0,
    page: {
      current: 1,
      currentIndex: 0,
    },
    show: false,
  });

  //-----------------------------------------get state from axios call-------------------------------------------//
  useEffect(() => {
    getAllRecommendationsPages();
  }, [recommendationsState?.page?.currentIndex]);

  const onPageChange = (newPage) => {
    _logger(`current page: ${JSON.stringify(recommendationsState.page)}`);
    _logger(`changing page.current to: ${newPage}`);

    setRecommendationsState((prevState) => {
      const newState = { ...prevState };
      newState.page.current = newPage;
      newState.page.currentIndex = newPage - 1;
      return newState;
    });
  };

  const getAllRecommendationsPages = () => {
    _logger(`current page: ${JSON.stringify(recommendationsState.page)}`);

    recommendationsService
      .getAllPagedRecommendations(recommendationsState.page.currentIndex, 5) // this will need to be unhardcoded
      .then(onGetAllRecommendationsSuccess)
      .catch(onGetAllRecommendationsError);
  };

  const onGetAllRecommendationsSuccess = (response) => {
    _logger("checking axios response", response.value.item);

    let pagedItems = response.value.item.pagedItems;
    let totalCount = response.value.item.totalCount;

    setRecommendationsState((prevState) => {
      const newState = { ...prevState };
      newState.totalNumRecommendations = totalCount * 2;
      newState.recommendations = pagedItems;
      newState.mappedRecommendations =
        newState.recommendations.map(mapRecommendations);
      if (!newState.show) {
        newState.show = true;
      }

      return newState;
    });
  };

  const onGetAllRecommendationsError = (err) => {
    _logger(err);
    Toastify({
      text: "Looks like we ran into an error! Please try again.",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  };
  //--------------------------------------------------------------Mapper--------------------------------------------------------------------//
  const mapRecommendations = (recommItem) => {
    return (
      <RecommendationsTableRow //RecommendationsTableRow
        recommendation={recommItem}
        key={recommItem.id}
        onRecommendationIsActiveClick={onIsActiveButtonClick}
        onRecommendationIsDeletedClick={onIsDeletedButtonClick}
      />
    );
  };

  // --------------------------------------isActive service function----------------------------

  const onIsActiveButtonClick = useCallback((recommendationId, isActive, e) => {
    _logger(recommendationId, isActive, e);

    const handler = onIsActiveSuccessHandler(recommendationId, !isActive);
    recommendationsService
      .updateIsActive(recommendationId, !isActive)
      .then(handler)
      .catch(onIsActiveButtonError);
  });

  const onIsActiveSuccessHandler = (recommendationId, isActive) => {
    _logger(recommendationId, isActive);
    if (recommendationId) {
      setRecommendationsState((prevState) => {
        const newSt = { ...prevState };
        newSt.recommendations = [...prevState.recommendations];

        let indexOf = newSt.recommendations.findIndex(
          (obj) => obj.id === recommendationId
        );

        if (indexOf > -1) {
          newSt.recommendations[indexOf].isActive = isActive;

          newSt.mappedRecommendations =
            newSt.recommendations.map(mapRecommendations);
        }
        return newSt;
      });
    }
  };

  const onIsActiveButtonError = (err) => {
    _logger("onIsActiveButtonError", err);
    Toastify({
      text: "Looks like we ran into an error! Please try again.",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  };

  //--------------------------------------isDeleted service function----------------------------

  const onIsDeletedButtonClick = useCallback(
    (recommendationId, isDeleted, e) => {
      _logger("coming from children", recommendationId, isDeleted, e);
      const handler = onIsDeletedSuccessHandler(recommendationId, !isDeleted);
      recommendationsService
        .updateIsDeleted(recommendationId, !isDeleted)
        .then(handler)
        .catch(onIsDeletedButtonError);
    }
  );

  const onIsDeletedSuccessHandler = (recommendationId, isDeleted) => {
    _logger(recommendationId, isDeleted);
    if (recommendationId) {
      setRecommendationsState((prevState) => {
        const newSt = { ...prevState };
        newSt.recommendations = [...prevState.recommendations];
        let indexOf = newSt.recommendations.findIndex(
          (obj) => obj.id === recommendationId
        );

        if (indexOf > -1) {
          newSt.recommendations[indexOf].isDeleted = isDeleted;

          newSt.mappedRecommendations =
            newSt.recommendations.map(mapRecommendations);

          _logger(
            "On array",
            newSt.recommendations[indexOf].isDeleted,
            "new value",
            newSt.recommendations
          );
        }
        return newSt;
      });
    }
  };

  const onIsDeletedButtonError = (err) => {
    _logger("onIsDeletedButtonError", err);
    Toastify({
      text: "Looks like we ran into an error! Please try again.",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  };

  //------------------------------------Toggler------------------------------------
  const onClickShowRecomms = (e) => {
    e.preventDefault;
    getAllRecommendationsPages();
  };

  //------------------------------------//------------------------------------
  return (
    <React.Fragment>
      <div className="container d-flex justify-content-center mt-5">
        <div className="bg-1000 border card w-100">
          <div className="col mt-2 text-center"></div>
          <h1
            onClick={onClickShowRecomms}
            className="mt-2 text-center text-white"
          >
            Recommendations
          </h1>

          <Table hover responsive>
            <thead className="text-white">
              <tr>
                <th scope="col" className="d-none">
                  Id
                </th>
                <th scope="col">Partner name</th>
                <th scope="col">Ordered product</th>
                <th scope="col">Stand Id ordered from</th>
                <th scope="col">Hourly cost</th>
                <th scope="col">Upsell product</th>
                <th scope="col">Stand Id of upsell</th>
                <th scope="col">Hourly cost</th>
                <th scope="col">Reason for upsell</th>
                <th scope="col">Active status</th>
                <th scope="col">Deleted status</th>
                <th scope="col">Toggle status</th>
              </tr>
            </thead>

            <tbody className="text-white">
              {recommendationsState.mappedRecommendations}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="container d-flex justify-content-center mt-5">
        <Pagination
          onChange={onPageChange}
          current={recommendationsState.page.current}
          total={recommendationsState.totalNumRecommendations}
        />
      </div>
      <div className="container d-flex justify-content-center mt-5">
        <Button
          as={Link}
          variant="outline-light"
          className="m-auto"
          to="/recommendations/new"
        >
          New recommendation
        </Button>
      </div>
    </React.Fragment>
  );
}

ViewRecommendations.propTypes = {
  aRecommendation: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default ViewRecommendations;
