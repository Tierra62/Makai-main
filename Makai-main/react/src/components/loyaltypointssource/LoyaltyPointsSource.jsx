import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Container, Table } from "react-bootstrap";
import Flex from "components/common/Flex";
import * as loyaltyPointsSourceService from "../../services/loyaltyPointsSourceService";
import LoyaltyPointsSourceTotal from "./LoyaltyPointsSourceTotal";
import LoyaltyPointsSourceCreate from "./LoyaltyPointsSourceCreate";
import swal from "sweetalert";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import toastr from "toastr";
import "toastr/build/toastr.css";
import debug from "sabio-debug";
import PropTypes from "prop-types";

const _logger = debug.extend("LoyaltySource");

const LoyaltyPointsSource = (props) => {
  const [pointsSourceData, setPointsSourceData] = useState({
    pointsSourceList: [],
    pointsSourceComponents: [],
    pageIndex: 1,
    pageSize: 10,
    pageTotal: 0,
  });

  _logger(pointsSourceData);

  const fetchLoyaltyPoint = () => {
    loyaltyPointsSourceService
      .getAll(pointsSourceData.pageIndex - 1, pointsSourceData.pageSize)
      .then(onGetAllSuccess)
      .catch(onGetAllError);
  };

  useEffect(() => {
    fetchLoyaltyPoint();
  }, [pointsSourceData.pageIndex]);

  const onChange = (page) => {
    _logger("onChange", page);
    setPointsSourceData((prevState) => {
      const newIndex = { ...prevState };
      newIndex.pageIndex = page;
      return newIndex;
    });
  };

  const onGetAllSuccess = (response) => {
    _logger("onGetAllSuccess", response);
    let pageResponse = response.item;
    let arrayOfResponse = response.item.pagedItems;

    _logger("array from page", arrayOfResponse);
    setPointsSourceData((prevState) => {
      const pointsSourceData = { ...prevState };
      pointsSourceData.pointsSourceList = arrayOfResponse;
      pointsSourceData.pageTotal = pageResponse.totalCount;
      pointsSourceData.pointsSourceComponents = arrayOfResponse.map(mapTable);
      return pointsSourceData;
    });
  };

  const mapTable = (loyaltyPointSource) => {
    loyaltyPointsSourceService
      .isExpired(loyaltyPointSource.id)
      .then(onExpireSuccess)
      .catch(onExpireError);
    return (
      <LoyaltyPointsSourceTotal
        loyaltyPointSource={loyaltyPointSource}
        key={loyaltyPointSource.id}
        onDeleteBtnClicked={onDeleteBtnClicked}
      />
    );
  };

  const onExpireSuccess = (response) => {
    _logger(
      "success scanning and updating expiration date if needed",
      response
    );
  };

  const navigate = useNavigate();
  const handleSubmit = useCallback(
    (formData) => {
      _logger("to be edited/submitted info", formData);
      if (formData.id) {
        const handler = getEditSuccessHandler(formData.id, formData);
        loyaltyPointsSourceService
          .updateSource(formData, formData.id)
          .then(handler)
          .catch(onErrorEditSource);
      } else {
        loyaltyPointsSourceService
          .createSource(formData)
          .then((response) => getCreateSuccessHandler(response.item, formData))
          .catch(onErrorCreateSource);
      }
    },
    [setPointsSourceData]
  );

  const getEditSuccessHandler = (idToEdit, formData) => {
    toastr.success("Loyalty Point Source was updated successfully");

    const formattedExpireDate = formData.dateExpire
      ? formData.dateExpire.toISOString()
      : null;

    setPointsSourceData((prevList) => {
      const updatedList = [...prevList.pointsSourceList];
      const indexToUpdate = updatedList.findIndex(
        (item) => item.id === idToEdit
      );
      if (indexToUpdate >= 0) {
        const todayDate = new Date();
        const isExpired =
          formData.dateExpire && todayDate > formData.dateExpire;
        const nameSuffix = isExpired ? " (Expired)" : "";
        const updatedName =
          formData.name + (formData.dateExpire ? nameSuffix : "");
        updatedList[indexToUpdate] = {
          ...updatedList[indexToUpdate],
          ...formData,
          name: updatedName,
          dateExpire: formattedExpireDate,
        };
        _logger(
          "Updated record:",
          updatedList[indexToUpdate],
          formData.dateExpire
        );
      }
      const updatedComponents = updatedList.map(mapTable);
      return {
        pointsSourceList: updatedList,
        pointsSourceComponents: updatedComponents,
        pageIndex: prevList.pageIndex,
        pageSize: prevList.pageSize,
        pageTotal: prevList.pageTotal,
      };
    });
    navigate("/admin/loyaltypointssource/"); //after edit is success, change the url back to original
  };

  const todayDate = new Date();
  const formattedDate = todayDate.toISOString();

  const getCreateSuccessHandler = useCallback(
    (newId, formData) => {
      const formattedExpireDate = formData.dateExpire
        ? formData.dateExpire.toISOString()
        : null;
      toastr.success("Loyalty Point Source was created successfully");
      setPointsSourceData((prevState) => {
        const newState = { ...prevState };
        if (prevState.pointsSourceList?.length < pointsSourceData.pageSize) {
          //UI re-render
          const updatedList = [...prevState.pointsSourceList];
          updatedList.push({
            id: newId,
            name: formData.name,
            pointsAwarded: formData.pointsAwarded,
            dateExpire: formattedExpireDate,
            dateCreated: formattedDate,
            dateModified: formattedDate,
            modifiedBy: props.currentUser.name,
            createdBy: props.currentUser.name,
          });
          newState.pointsSourceList = updatedList;
          newState.pointsSourceComponents = updatedList.map(mapTable); //if the current page list is LESS THAN 10, map the item on the current page
          newState.pageTotal = prevState.pageTotal + 1; //AND increase the pageTotal.
        } else {
          newState.pageTotal = prevState.pageTotal + 1; //if the current page list is OVER 10, change the pageTotal.
          //if the page index was changed, (ig. 1 to 2) the page will re-render anyway.
        }
        return newState;
      });
    },
    [pointsSourceData, setPointsSourceData]
  );

  const onDeleteBtnClicked = useCallback((deleteInfo) => {
    _logger("to be deleted info", deleteInfo);
    swal({
      title: "DELETE",
      text: `Are you sure you want to delete "${deleteInfo.name}"?`,
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes, confirm",
          value: true,
          visible: true,
          className: "btn-danger btn",
          closeModal: true,
        },
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "btn-success btn",
          closeModal: true,
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        swal(`"${deleteInfo.name}" has been deleted!`, { icon: "success" });
        loyaltyPointsSourceService
          .isDeleted(deleteInfo.id)
          .then(getDeleteSuccessHandler)
          .catch(onDeleteError);
      } else {
      }
    });
  }, []);

  const getDeleteSuccessHandler = () => {
    setPointsSourceData((prevState) => {
      const newIndex = { ...prevState };
      newIndex.pageIndex = 1;
      return newIndex;
    });
    fetchLoyaltyPoint();
  };

  const onDeleteError = (error) => {
    _logger("error delete source", error);
    toastr.error("Failed to delete Loyalty Points Source");
  };

  const onGetAllError = (error) => {
    _logger("error get all source", error);
    toastr.error("Failed to get Loyalty Points Sources");
  };

  const onErrorEditSource = (error) => {
    _logger("error edit source", error);
    toastr.error("Failed to update Loyalty Points Source. Please try again.");
  };

  const onErrorCreateSource = (error) => {
    _logger("error create source", error);
    toastr.error("Failed to create Loyalty Points Source. Please try again.");
  };

  const onExpireError = (error) => {
    _logger("error update expire source", error);
  };

  return (
    <>
      <Container fluid>
        <Row className="mt-5">
          <Card className="col-lg-8 m-1">
            <h2 className="mx-3 mt-4">Loyalty Points Source</h2>
            <Card.Body>
              <Flex justifyContent="space-between" alignItems="end">
                <Col>
                  <Pagination
                    className=" mb-3"
                    onChange={onChange}
                    current={pointsSourceData.pageIndex}
                    total={pointsSourceData.pageTotal}
                    pageSize={pointsSourceData.pageSize}
                    locale={locale}
                  />
                </Col>
              </Flex>
              <div className="table-responsive">
                <Table className="table table-bordered table-hover">
                  <thead className="table-primary">
                    <tr>
                      {/* <th className="border-0">Id</th> */}
                      <th className="border-0">Point Name</th>
                      <th className="border-0">Points</th>
                      <th className="border-0">Effective Until</th>
                      <th className="border-0">Created Date</th>
                      <th className="border-0">Created By</th>
                      <th className="border-0">Modified Date</th>
                      <th className="border-0">Modified By</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>{pointsSourceData.pointsSourceComponents}</tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          <div className="col-lg-3 mt-1 course-filter">
            <LoyaltyPointsSourceCreate onSubmit={handleSubmit} />
          </div>
        </Row>
      </Container>
    </>
  );
};

LoyaltyPointsSource.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }).isRequired,
};

export default LoyaltyPointsSource;
