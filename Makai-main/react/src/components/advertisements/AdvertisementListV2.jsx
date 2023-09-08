import React, { useEffect, useState, useCallback } from "react";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import advertisementService from "services/advertisementService";
import AdvertisementCardV2 from "./AdvertisementCardV2";
import { Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toastr from "toastr";
import "./advertisement-v2.css";

const _logger = debug.extend("advertisement");

function AdvertisementListV2() {
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

  const mapAdvertisement = (anAd) => {
    return (
      <AdvertisementCardV2
        advertisement={anAd}
        key={"advertisement" + anAd.id}
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
      _logger(newList, "Before");
      newList.pageIndex = page - 1;
      _logger(newList, "After");
      return newList;
    });
  };

  return (
    <React.Fragment>
      <Container>
        {/* ToolBar Start */}
        <Row className="advertisement-rounded">
          <Col md="4">
            <Button
              as={Link}
              to="/advertisements/form"
              className="btn btn-warning newAdvertisement-me-auto mt-2"
              type="button"
              id="newAdvertisement"
            >
              +New Ad.
            </Button>
          </Col>
          <Col md="4">
            <div className="advertisement-text-center text-center">
              <h1>Advertisements</h1>
            </div>
          </Col>
          <Col md="4" className="justify-content-end d-flex">
            <Button
              as={Link}
              variant="outline-light"
              className="my-2 px-4"
              to="/advertisements/table"
            >
              Go To Table View
            </Button>
          </Col>
        </Row>
        {/* ToolBar End */}

        {/* CardGroup Start */}
        <Row className="py-3 text-center">
          {pageData.advertisementsComponents}
        </Row>
        <Row className="justify-content-center text-center">
          <Pagination
            locale={locale}
            current={pageData.pageIndex + 1}
            total={pageData.totalCount}
            pageSize={pageData.pageSize}
            onChange={onChangePage}
          />
        </Row>
        {/* CardGroup End */}
      </Container>
    </React.Fragment>
  );
}

export default AdvertisementListV2;
