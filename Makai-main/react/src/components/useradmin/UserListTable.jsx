import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import Swal from "sweetalert2";
import userService from "services/userService";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTh } from "@fortawesome/free-solid-svg-icons";
import "../useradmin/UserList.css";

function UserListTable() {
  const [tableData, setTableData] = useState({
    usersList: [],
    userComponents: [],
    pageIndex: 0,
    pageSize: 9,
    totalCount: 0,
    query: "",
  });

  const AlertError = () => {
    Swal.fire(
      "Something went wrong!",
      "Click button again to revert back.",
      "error"
    );
  };

  useEffect(() => {
    if (tableData.query) {
      userService
        .onClickSearchUser(
          tableData.query,
          tableData.pageIndex,
          tableData.pageSize
        )
        .then(searchSuccess)
        .catch(searchError);
    } else {
      userService
        .onGetUsers(tableData.pageIndex, tableData.pageSize)
        .then(onGetUsersSuccess)
        .catch(onGetUsersError);
    }
  }, [tableData.pageIndex, tableData.pageSize, tableData.query]);

  const searchSuccess = (response) => {
    setTableData((prevState) => {
      const newTable = { ...prevState };
      newTable.usersList = response.item.pagedItems;
      newTable.totalCount = response.item.totalCount;
      newTable.pageIndex = newTable.pageIndex;
      return newTable;
    });
  };

  const searchError = () => {
    AlertError();
  };

  const onGetUsersSuccess = (response) => {
    setTableData((prevState) => {
      const newTable = { ...prevState };
      newTable.usersList = response.item.pagedItems;
      newTable.totalCount = response.item.totalCount;
      return newTable;
    });
  };

  const onGetUsersError = () => {
    AlertError();
  };

  const onChangePage = (page) => {
    setTableData((prevState) => {
      const newTable = { ...prevState };
      newTable.pageIndex = page - 1;
      return newTable;
    });
  };

  const onFormFieldChange = (event) => {
    const query = event.target.value;
    setTableData((prevState) => {
      const newQueryObject = { ...prevState };
      newQueryObject[event.target.name] = query;
      newQueryObject.pageIndex = 0;
      return newQueryObject;
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mb-3">
          <div className="card user-admin-card3 cardheader col-sm-12 pb-1">
            <div className="row">
              <div className="col-lg-8 user-admin-custom-class2">
                <h3 className="mt-4">Users List</h3>
              </div>
            </div>
            <div className="row col-md-12 mb-3">
              <div className="d-flex justify-content-end">
                <Col xs="auto" className="p-0">
                  <Row className="g- align-items-center">
                    <Col xs="auto">
                      <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip>User Grid</Tooltip>}
                      >
                        <Link to="/userlist" className={`me-3`} id="grid-icon">
                          <FontAwesomeIcon
                            icon={faTh}
                            transform="down-3"
                            className="fs-1 icongrid user-admin-icongrid2"
                          />
                        </Link>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="left"
                        className="tooltip"
                        overlay={<Tooltip>User Table</Tooltip>}
                      >
                        <Link
                          to="/usertableview"
                          className={`me-2`}
                          id="table-icon"
                        >
                          <FontAwesomeIcon
                            icon={faList}
                            transform="down-3"
                            className="fs-1 iconlist user-admin-iconlist2 hover-700"
                          />
                        </Link>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Col>
              </div>
            </div>
            <div className="row">
              <div className="bg-holder d-none d-lg-block bg-card user-admin-bg-card1 mt-4">
                <div id="tableExample3"></div>
                <div className="row justify-content-end g-0 mt-8">
                  <div className="col-auto col-sm-5 mb-3">
                    <form>
                      <div className="input-group">
                        <input
                          className="form-control form-control-sm shadow-none search"
                          type="search"
                          name="query"
                          placeholder="Search..."
                          aria-label="search"
                          onChange={onFormFieldChange}
                        />
                        <div className="input-group-text bg-transparent">
                          <span className="fa fa-search fs--1 text-600"></span>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="table-responsive scrollbar mt-1">
                    <table className="table table-bordered table-striped fs--1 mb-0">
                      <thead className="bg-200 text-900">
                        <tr>
                          <th className="sort" data-sort="name">
                            Name
                          </th>
                          <th className="sort" data-sort="email">
                            Email
                          </th>
                          <th className="sort" data-sort="role">
                            Role
                          </th>
                          <th className="sort" data-sort="status">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list bg-300">
                        {tableData.usersList &&
                          tableData.usersList.map((user) => (
                            <tr key={user.id}>
                              <td>{`${user.firstName} ${user.lastName}`}</td>
                              <td>{user.email}</td>
                              <td>
                                {user.roles && user.roles.length > 0 && (
                                  <div>{user.roles[0].name}</div>
                                )}
                              </td>
                              <td>{user.statusType.name}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 pagination-col">
                    <div className="row pagination3 mb-3 justify-content-center">
                      {tableData.userComponents}
                      <Pagination
                        locale={locale}
                        current={tableData.pageIndex + 1}
                        total={tableData.totalCount}
                        pageSize={tableData.pageSize}
                        onChange={onChangePage}
                        className="pagination user-admin-pagination2 mx-auto justify-content-center mb-7"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserListTable.propTypes = {
  userstable: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      dob: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
      statusType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    })
  ),
};

export default UserListTable;
