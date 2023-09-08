import React, { useEffect, useState } from "react";
import "./stripe.css";
import AdvanceTable from "components/common/advancetable/AdvanceTable.jsx";
import AdvanceTableFooter from "components/common/advancetable/AdvanceTableFooter.jsx";
import AdvanceTableWrapper from "components/common/advancetable/AdvanceTableWrapper.jsx";
import AdvanceTableSearchBox from "components/common/advancetable/AdvanceTableSearchBox";
import * as stripeService from "../../services/stripeService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import debug from "sabio-debug";
const _logger = debug.extend("partnerAccounts");

const columns = [
  {
    accessor: "userId",
    Header: "User Id",
  },
  {
    accessor: "stripeAccountId",
    Header: "Stripe Account Id",
  },
  {
    accessor: "name",
    Header: "Email",
  },
];

function StripeDashboard() {
  const [stripeTransactions, setStripeTransactions] = useState([]);

  useEffect(() => {
    stripeService
      .getAllAccounts()
      .then(onGetAllAccountsSuccess)
      .catch(onGetAllAccountsError);
  }, []);

  const onGetAllAccountsSuccess = (response) => {
    _logger(response?.items, "get all partner accounts");
    setStripeTransactions(response?.items);
  };
  const onGetAllAccountsError = () => {
    Toastify({
      text: "Please try again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  return (
    <div className="container justify-content-center pt-4">
      <div className="row">
        <div className="col-12 text-center">
          <Card className="success-card">
            <Card.Body>
              <Card.Title>Partner Accounts</Card.Title>
              <AdvanceTableWrapper
                columns={columns}
                data={stripeTransactions}
                sortable
                pagination
                perPage={5}
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
      </div>
    </div>
  );
}

export default StripeDashboard;
