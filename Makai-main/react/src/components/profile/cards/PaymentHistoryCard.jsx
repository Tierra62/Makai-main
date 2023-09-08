import React, { useState, useEffect } from "react";
import * as orderService from "../../../services/orderService";
import AdvanceTableWrapper from "components/common/advancetable/AdvanceTableWrapper";
import AdvanceTable from "components/common/advancetable/AdvanceTable";
import moment from "moment";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import toastr from "toastr";
import { Card } from "react-bootstrap";
import FalconCardHeader from "components/common/FalconCardHeader";
import "../profile.css";

const _logger = debug.extend("profile");

const columns = [
  {
    accessor: "orderId",
    Header: "Order #",
  },
  {
    accessor: "paymentStatus",
    Header: "Status",
  },
  {
    accessor: "paymentType",
    Header: "Type",
  },
  {
    accessor: "totalPrice",
    Header: "Total",
  },
  {
    accessor: "transactionDate",
    Header: "Date",
  },
];

function PaymentHistoryCard() {
  const [pageData, setPageData] = useState({
    orderPayments: [],
    hasPayments: "",
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
  });

  useEffect(() => {
    const pageIndex = pageData.currentPage - 1;
    orderService
      .getCurrentUserPayments(pageIndex, pageData.pageSize)
      .then(onGetPaymentHistorySuccess)
      .catch(onGetPaymentHistoryError);
  }, []);

  const onGetPaymentHistorySuccess = (data) => {
    const payments = data.item.pagedItems;
    if (payments && payments.length > 0) {
      setPageData((prevState) => {
        let pd = { ...prevState };
        pd.orderPayments = payments.map(mapPaymentToRecordData);
        pd.hasPayments = "true";
        if (prevState.totalCount === 0) {
          pd.totalCount = data.item.totalCount;
        }
        return pd;
      });
    }
  };

  const mapPaymentToRecordData = (paymentObj) => {
    const paymentModifiedDate = moment(
      paymentObj.transactionDateModified
    ).format("MM/DD/YYYY hh:mm a");

    const recordDataObj = {
      orderId: paymentObj.id,
      paymentStatus: paymentObj.paymentStatus,
      paymentType: paymentObj.transactionType,
      transactionDate: paymentModifiedDate,
    };

    let taxCalculated = false;
    if (paymentObj.totalPriceWithTax && paymentObj.totalPriceWithTax > 0) {
      taxCalculated = true;
    }
    let hasInsurance = false;
    if (
      paymentObj.insurancePriceInCents &&
      paymentObj.insurancePriceInCents > 0
    ) {
      hasInsurance = true;
    }

    let totalPrice = paymentObj.totalPriceInCents;
    let includesTax = "w/out tax";
    if (taxCalculated) {
      totalPrice = paymentObj.totalPriceWithTax;
      includesTax = "w/ tax";
    }
    if (hasInsurance) {
      totalPrice += paymentObj.insurancePriceInCents;
    }

    recordDataObj.totalPrice = `$${(totalPrice / 100).toFixed(
      2
    )} ${includesTax}`;

    return recordDataObj;
  };

  const onGetPaymentHistoryError = (err) => {
    _logger({ err });

    if (err.response.status === 404) {
      setPageData((prevState) => {
        let pd = { ...prevState };
        pd.hasPayments = "false";
        return pd;
      });
    } else {
      setPageData((prevState) => {
        let pd = { ...prevState };
        pd.hasPayments = "true";
        return pd;
      });
      toastr.error("Error Loading Payment History");
    }
  };

  const onPageChange = (newPage) => {
    setPageData((prevState) => {
      let pd = { ...prevState };
      pd.currentPage = newPage;
      return pd;
    });
    const pageIndex = newPage - 1;
    orderService
      .getCurrentUserPayments(pageIndex, pageData.pageSize)
      .then(onGetPaymentHistorySuccess)
      .catch(onGetPaymentHistoryError);
  };

  return (
    <Card>
      <FalconCardHeader title="Payment History" />
      <Card.Body className="bg-light">
        {pageData.hasPayments === "true" && (
          <AdvanceTableWrapper
            columns={columns}
            data={pageData.orderPayments}
            sortable
            isPaginated
            perPage={pageData.pageSize}
          >
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
        )}
        {pageData.hasPayments === "false" && (
          <h5 className="no-orders">
            Please place an order to view payment history
          </h5>
        )}

        {pageData.totalCount > pageData.pageSize && (
          <div className="mt-3">
            <Pagination
              current={pageData.currentPage}
              onChange={onPageChange}
              pageSize={pageData.pageSize}
              total={pageData.totalCount}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default PaymentHistoryCard;
