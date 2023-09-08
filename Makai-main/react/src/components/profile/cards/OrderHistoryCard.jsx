import React, { useEffect, useState } from "react";
import AdvanceTableWrapper from "components/common/advancetable/AdvanceTableWrapper";
import AdvanceTable from "components/common/advancetable/AdvanceTable";
import * as orderService from "../../../services/orderService";
import debug from "sabio-debug";
import Accordion from "react-bootstrap/Accordion";
import moment from "moment";
import SoftBadge from "components/common/SoftBadge";
import { Row, Col, Table, Card } from "react-bootstrap";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import toastr from "toastr";
import FalconCardHeader from "components/common/FalconCardHeader";
import "../profile.css";

const _logger = debug.extend("profile");

const columns = [
  {
    accessor: "productName",
    Header: "Product",
  },
  {
    accessor: "productDescription",
    Header: "Product Description",
  },
  {
    accessor: "hourlyPrice",
    Header: "Hourly Price",
  },
  {
    accessor: "estimatedRentalTime",
    Header: "Rental Time",
  },
  {
    accessor: "itemTotal",
    Header: "Item Total",
  },
];

let eventKey = "0";

const orderStatusToPillColor = {
  1: "warning",
  2: "secondary",
  3: "success",
  4: "danger",
  5: "info",
};

function OrderHistoryCard() {
  const [pageData, setPageData] = useState({
    orders: [],
    hasOrders: "",
    currentPage: 1,
    pageSize: 6,
    totalCount: 0,
  });

  useEffect(() => {
    let pageIndex = pageData.currentPage - 1;
    orderService
      .getCurrentUserOrders(pageIndex, pageData.pageSize)
      .then(onGetOrderHistorySuccess)
      .catch(onGetOrderHistoryError);
  }, []);

  const onGetOrderHistorySuccess = (data) => {
    setPageData((prevState) => {
      let pd = { ...prevState };
      pd.orders = data.item.pagedItems.map(mapOrderToAccordianItem);
      pd.hasOrders = "true";
      if (prevState.totalCount === 0) {
        pd.totalCount = data.item.totalCount;
      }
      return pd;
    });
  };

  const mapOrderToAccordianItem = (orderObj) => {
    let table = "No Order Items To Display";
    if (orderObj.orderItems && orderObj.orderItems.length > 0) {
      let records = orderObj.orderItems.map(mapOrderItemToRecordData);
      table = mapRecordsDataToTable(records);
    }
    const orderDate = moment(orderObj.dateCreated).format(
      "MMM Do YYYY, h:mm a"
    );
    let taxCalculated = false;
    if (orderObj.totalPriceWithTax && orderObj.totalPriceWithTax > 0) {
      taxCalculated = true;
    }
    let hasInsurance = false;
    if (orderObj.insurancePriceInCents && orderObj.insurancePriceInCents > 0) {
      hasInsurance = true;
    }

    const numberOfItems = orderObj.orderItems ? orderObj.orderItems.length : 0;

    let totalPrice = orderObj.totalPriceInCents;
    if (taxCalculated) {
      totalPrice = orderObj.totalPriceWithTax;
    }
    if (hasInsurance) {
      totalPrice += orderObj.insurancePriceInCents;
    }

    return (
      <Accordion.Item
        eventKey={`${Number(eventKey++)}`}
        key={`orderAccordianItem-${orderObj.id}`}
      >
        <Accordion.Header>
          <div className="container">
            <div className="row text-center">
              <strong className="col-12 col-sm-4 col-lg-3 text-start">
                Order # {orderObj.id}
              </strong>
              <strong className="col-lg-3 hidden-under-lg">
                Items ({numberOfItems})
              </strong>
              <strong className="col-6 col-sm-4 col-lg-3">
                <SoftBadge
                  pill
                  bg={orderStatusToPillColor[orderObj.orderStatus.id]}
                >
                  {orderObj.orderStatus.name}
                </SoftBadge>
              </strong>
              <strong className="col-6 col-sm-4 col-lg-3">
                ${(totalPrice / 100).toFixed(2)}
              </strong>
              <div className="col-12 text-start mt-2">{orderDate}</div>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body className="bg-light">
          {table}
          {table !== "No Order Items To Display" && (
            <Row className="g-0 justify-content-end">
              <Col xs="auto">
                <Table borderless size="sm" className="fs--1 text-end">
                  <tbody>
                    <tr>
                      <th className="text-900">Subtotal:</th>
                      <td className="fw-semi-bold">
                        ${(orderObj.totalPriceInCents / 100).toFixed(2)}
                      </td>
                    </tr>
                    {taxCalculated && (
                      <tr>
                        <th className="text-900">Estimated Tax:</th>
                        <td className="fw-semi-bold">
                          $
                          {(
                            (orderObj.totalPriceWithTax -
                              orderObj.totalPriceInCents) /
                            100
                          ).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {hasInsurance && (
                      <tr>
                        <th className="text-900">Insurance:</th>
                        <td className="fw-semi-bold">
                          {`$${(orderObj.insurancePriceInCents / 100).toFixed(
                            2
                          )}`}
                        </td>
                      </tr>
                    )}
                    <tr className="border-top">
                      <th className="text-900">Total:</th>
                      <td className="fw-semi-bold">
                        ${(totalPrice / 100).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Accordion.Body>
      </Accordion.Item>
    );
  };

  const mapOrderItemToRecordData = (orderItemObj) => {
    const startTime = new Date(orderItemObj.estimatedStartTime);
    const stopTime = new Date(orderItemObj.estimatedStopTime);
    const rentalTime = Math.abs(stopTime - startTime) / 36e5;

    let rentalString = `${rentalTime} hour`;
    if (rentalTime !== 1) {
      rentalString = `${rentalTime} hours`;
    }

    const recordData = {
      productName: orderItemObj.product.name,
      productDescription: orderItemObj.product.description,
      hourlyPrice: `$${(orderItemObj.product.hourlyPriceInCents / 100).toFixed(
        2
      )} `,
      estimatedRentalTime: rentalString,
      itemTotal: `$${(orderItemObj.priceInCents / 100).toFixed(2)} `,
    };

    return recordData;
  };

  const mapRecordsDataToTable = (recordsDataArray) => {
    return (
      <AdvanceTableWrapper columns={columns} data={recordsDataArray} sortable>
        <AdvanceTable
          table
          headerClassName="bg-200 text-900 text-nowrap align-middle"
          rowClassName="align-middle white-space-nowrap"
          tableProps={{
            bordered: true,
            striped: false,
            className: "fs--1 mb-0 overflow-hidden",
          }}
        />
      </AdvanceTableWrapper>
    );
  };

  const onGetOrderHistoryError = (err) => {
    _logger("error", { err });
    _logger("status code", err.response.status);
    if (err.response.status === 404) {
      _logger("404 Error");
      setPageData((prevState) => {
        let pd = { ...prevState };
        pd.hasOrders = "false";
        return pd;
      });
    } else {
      toastr.error("Error Loading Order History");
      setPageData((prevState) => {
        let pd = { ...prevState };
        pd.hasOrders = "true";
        return pd;
      });
    }
  };

  const onPageChange = (page) => {
    setPageData((prevState) => {
      let pd = { ...prevState };
      pd.currentPage = page;
      return pd;
    });
    const pageIndex = page - 1;
    orderService
      .getCurrentUserOrders(pageIndex, pageData.pageSize)
      .then(onGetOrderHistorySuccess)
      .catch(onGetOrderHistoryError);
  };
  return (
    <Card>
      <FalconCardHeader title="Order History" />
      <Card.Body className="bg-light">
        {pageData.hasOrders === "true" && (
          <Accordion flush>{pageData.orders}</Accordion>
        )}
        {pageData.hasOrders === "false" && (
          <h5 className="no-orders">
            Please place an order to view order history
          </h5>
        )}
        {pageData.totalCount > pageData.pageSize && (
          <Pagination
            className="m-3"
            current={pageData.currentPage}
            onChange={onPageChange}
            pageSize={pageData.pageSize}
            total={pageData.totalCount}
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default OrderHistoryCard;
