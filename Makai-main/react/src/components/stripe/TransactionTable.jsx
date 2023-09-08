import React from "react";
import "./stripe.css";
import AdvanceTable from "components/common/advancetable/AdvanceTable";
import AdvanceTableFooter from "components/common/advancetable/AdvanceTableFooter";
import AdvanceTableWrapper from "components/common/advancetable/AdvanceTableWrapper";

const columns = [
  {
    accessor: "name",
    Header: "Name",
  },
  {
    accessor: "email",
    Header: "Email",
  },
  {
    accessor: "age",
    Header: "Age",
  },
];

const data = [
  {
    name: "Anna",
    email: "anna@example.com",
    age: 18,
  },
  {
    name: "Homer",
    email: "homer@example.com",
    age: 35,
  },
  {
    name: "Oscar",
    email: "oscar@example.com",
    age: 52,
  },
  {
    name: "Emily",
    email: "emily@example.com",
    age: 30,
  },
  {
    name: "Jara",
    email: "jara@example.com",
    age: 25,
  },
  {
    name: "Clark",
    email: "clark@example.com",
    age: 39,
  },
  {
    name: "Jennifer",
    email: "jennifer@example.com",
    age: 52,
  },
  {
    name: "Tony",
    email: "tony@example.com",
    age: 30,
  },
  {
    name: "Tom",
    email: "tom@example.com",
    age: 25,
  },
  {
    name: "Michael",
    email: "michael@example.com",
    age: 39,
  },
  {
    name: "Antony",
    email: "antony@example.com",
    age: 39,
  },
  {
    name: "Raymond",
    email: "raymond@example.com",
    age: 52,
  },
  {
    name: "Marie",
    email: "marie@example.com",
    age: 30,
  },
  {
    name: "Cohen",
    email: "cohen@example.com",
    age: 25,
  },
  {
    name: "Rowen",
    email: "rowen@example.com",
    age: 39,
  },
];

function TransactionTable() {
  return (
    <AdvanceTableWrapper
      columns={columns}
      data={data}
      sortable
      pagination
      perPage={5}
    >
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
          rowCount={data.length}
          table
          rowInfo
          navButtons
          rowsPerPageSelection
        />
      </div>
    </AdvanceTableWrapper>
  );
}

export default React.memo(TransactionTable);
