import React, { useEffect, useState } from "react";
import "./stripe.css";
import AdvanceTable from "components/common/advancetable/AdvanceTable.jsx";
import AdvanceTableFooter from "components/common/advancetable/AdvanceTableFooter.jsx";
import AdvanceTableWrapper from "components/common/advancetable/AdvanceTableWrapper.jsx";
import AdvanceTableSearchBox from "components/common/advancetable/AdvanceTableSearchBox";
import * as stripeService from "../../services/stripeService";
import TransferCard from "./TransferCard";
import PartnerAccounts from "./PartnerAccounts";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "react-toastify/dist/ReactToastify.css";
import SuccessImg from "../../assets/img/stripe/success.jpg";
import Avatar from "components/common/Avatar";
import debug from "sabio-debug";
const _logger = debug.extend("transfer");

const columns = [
  {
    accessor: "name",
    Header: "Payer Name",
  },
  {
    accessor: "email",
    Header: "Payer Email",
  },
  {
    accessor: "recipient",
    Header: "Recipient",
  },
  {
    accessor: "paymentStatus",
    Header: "Status",
  },
  {
    accessor: "amountTotal",
    Header: "Amount",
  },
  {
    accessor: "dateCreated",
    Header: "Date",
  },
];

function StripeDashboard() {
  const [stripeTransactions, setStripeTransactions] = useState([]);

  useEffect(() => {
    stripeService
      .getAllTransactions()
      .then(onGetAllTransactionsSuccess)
      .catch(onGetAllTransactionsError);
  }, []);

  const onGetAllTransactionsSuccess = (response) => {
    let mappedOrders = mapOrders(response?.items);
    setStripeTransactions(mappedOrders);
  };

  const mapOrders = function (ordersArray) {
    let mappedOrders = ordersArray.map((order) => {
      let orderDate = new Date(order?.dateCreated).toLocaleString();
      return {
        logo: <Avatar size="2xl" src={SuccessImg} width="60" alt="logo" />,
        userId: order?.userId,
        recipient: order?.recipient,
        paymentStatus: order?.paymentStatus,
        amountTotal: `$${order?.amountTotal / 100}`,
        dateCreated: orderDate,
        email: order?.email,
        name: `${order?.firstName} ${order?.lastName}`,
      };
    });
    _logger(mappedOrders, "mapped orders");
    return mappedOrders;
  };

  const onGetAllTransactionsError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  return (
    <div className="container pt-4 justify-content-center">
      <div className="row">
        <div className="col-lg-7 col-sm-12">
          <Card className="success-card text-center">
            <Card.Body>
              <Card.Title>All Transactions</Card.Title>
              <AdvanceTableWrapper
                columns={columns}
                data={stripeTransactions}
                sortable
                pagination
                perPage={12}
              >
                <Row className="flex-end-center mb-3">
                  <Col xs="auto" sm={6} lg={4}>
                    <AdvanceTableSearchBox table />
                  </Col>
                </Row>
                <AdvanceTable
                  table
                  headerClassName="bg-200 text-900 text-nowrap align-middle"
                  rowClassName="align-middle white-space-nowrap"
                  tableProps={{
                    bordered: true,
                    striped: true,
                    className: "fs--1 mb-0 overflow-hidden",
                  }}
                />
                <div className="mt-3">
                  <AdvanceTableFooter
                    rowCount={stripeTransactions.length}
                    table
                    rowInfo
                    navButtons
                    rowsPerPageSelection
                  />
                </div>
              </AdvanceTableWrapper>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-5 col-sm-12">
          <TransferCard />
          <PartnerAccounts />
        </div>
      </div>
    </div>
  );
}

export default StripeDashboard;
