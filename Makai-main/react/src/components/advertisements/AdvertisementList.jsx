import React, { useEffect, useState, useCallback } from "react";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import advertisementService from "services/advertisementService";
import AdvertisementCard from "./AdvertisementCard";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import toastr from "toastr";
import "./Advertisement.css";

const _logger = debug.extend("advertisement");

function AdvertisementList() {
  const [pageData, setPageData] = useState({
    advertisementsList: [],
    advertisementComponents: [],
    pageIndex: 0,
    pageSize: 3,
    totalCount: 0,
  });

  const AlertError = () => {
    Swal.fire(
      "Something went wrong!",
      "Click button again to revert back.",
      "error"
    );
  };

  const mapAdvertisement = (aAd) => {
    return (
      <AdvertisementCard
        advertisement={aAd}
        key={"advertisement" + aAd.id}
        onAdvertisementClicked={onDeleteRequested}
      />
    );
  };

  const onDeleteRequested = useCallback((remove) => {
    const handler = deleteSuccess(remove.id);
    _logger(handler);
    advertisementService
      .onDeleteById(remove.id)
      .then(handler)
      .catch(onDeleteError);
  }, []);
  const deleteSuccess = (advertisementId) => {
    toastr.success("Deleted advertisement record");
    setPageData((prevState) => {
      let pd = { ...prevState };
      const filteredArray = pd.advertisementsList.filter(
        (ad) => ad.id !== advertisementId
      );
      pd.advertisementsList = filteredArray;
      pd.advertisementComponents = filteredArray.map(mapAdvertisement);
      return pd;
    });
  };
  const onDeleteError = () => {
    toastr.error(" Could not delete advertisement record");
  };

  useEffect(() => {
    advertisementService
      .advertisementGetAll(pageData.pageIndex, pageData.pageSize)
      .then(onGetAdvertisementsSuccess)
      .catch(onGetAdvertisementsError);
  }, [pageData.pageIndex, pageData.pageSize]);

  const onGetAdvertisementsSuccess = (response) => {
    _logger(response);
    setPageData((prevState) => {
      const newList = { ...prevState };
      newList.advertisementsList = response.item.pagedItems;
      newList.advertisementsComponents =
        newList.advertisementsList.map(mapAdvertisement);
      newList.totalCount = response.item.totalCount;
      return newList;
    });
  };

  const onGetAdvertisementsError = (error) => {
    _logger(error);
    AlertError();
  };

  const onChangePage = (page) => {
    setPageData((prevState) => {
      const newList = { ...prevState };
      newList.pageIndex = page - 1;
      return newList;
    });
  };

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-3">
            <div className="card advertisement-card2 cardheader col-sm-12">
              <div className="row">
                <div className="col-lg-8 advertisement-custom-class">
                  <h3 className="mt-3"> Advertisements List</h3>
                </div>
              </div>

              <div className="bg-holder d-none d-lg-block bg-card advertisement-bg-card">
                <div className="row col-md-12 mb-3">
                  <div className="d-flex justify-content-end">
                    <Col xs="auto" className="p-0">
                      <Row className="g-2 align-items-center">
                        <Col xs="auto">
                          <OverlayTrigger
                            placement="top"
                            className="tooltip"
                            overlay={<Tooltip>Advertisement Table</Tooltip>}
                          >
                            <Link
                              to="/advertisements/table"
                              className={`me-2`}
                              id="table-icon"
                            >
                              <FontAwesomeIcon
                                icon={faList}
                                transform="down-3"
                                className="fs-1 iconlist advertisement-iconlist hover-700"
                              />
                            </Link>
                          </OverlayTrigger>
                        </Col>
                      </Row>
                    </Col>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 pagination-col">
              <div className="row row-cols-3 pagination2 mb-3 justify-content-center">
                {pageData.advertisementsComponents}
                <Pagination
                  locale={locale}
                  current={pageData.pageIndex + 1}
                  total={pageData.totalCount}
                  pageSize={pageData.pageSize}
                  onChange={onChangePage}
                  className="ant-pagination advertisement-pagination"
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <Link to="/advertisements/form">
              <button
                className="btn btn-primary newAdvertisement-me-auto mt-2"
                type="button"
                id="newAdvertisement"
              >
                Make New Advertisement
              </button>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default AdvertisementList;
