import React, { useEffect, useState } from "react";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import User from "./User";
import userService from "services/userService";
const _logger = debug.extend("userlist");
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTh } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "../useradmin/UserList.css";

function UserList() {
     const [pageData, setPageData] = useState({
          usersList: [],
          userComponents: [],
          pageIndex: 0,
          pageSize: 6,
          totalCount: 0,
          query: "",
     });

     const AlertError = () => {
          Swal.fire("Something went wrong!", "Click button again to revert back.", "error");
     };

     const mapUser = (aUser) => {
          return <User user={aUser} key={"UserList-" + aUser.id} onParentToggleStatus={onParentToggleStatus} />;
     };

     useEffect(() => {
          if (pageData.query) {
               userService
                    .onClickSearchUser(pageData.query, pageData.pageIndex, pageData.pageSize)
                    .then(searchSuccess)
                    .catch(searchError);
          } else {
               userService
                    .onGetUsers(pageData.pageIndex, pageData.pageSize)
                    .then(onGetUsersSuccess)
                    .catch(onGetUsersError);
          }
     }, [pageData.pageIndex, pageData.pageSize, pageData.newQuerySearch]);

     const onGetUsersSuccess = (response) => {
          setPageData((prevState) => {
               const newList = { ...prevState };
               newList.usersList = response.item.pagedItems;
               newList.userComponents = newList.usersList.map(mapUser);
               newList.totalCount = response.item.totalCount;
               return newList;
          });
     };

     const onGetUsersError = () => {
          AlertError();
     };

     const onDeactivateSuccess = (response, aUser) => {
          setPageData((prevState) => {
               const pd = { ...prevState };
               const indexOf = pd.usersList.findIndex((user) => {
                    let result = false;
                    if (user.id === aUser.id) {
                         result = true;
                    }
                    return result;
                    _logger(indexOf);
               });
               if (indexOf > -1) {
                    pd.usersList[indexOf].statusType.id = 2;
                    pd.usersList[indexOf].statusType.name = "Inactive";
                    pd.userComponents = pd.usersList.map(mapUser);
               }
               return pd;
          });
     };

     const onDeactivateError = () => {
          AlertError();
     };

     const onActivateSuccess = (response, aUser) => {
          _logger("response", response, aUser);
          setPageData((prevState) => {
               const pd = { ...prevState };
               const indexOf = pd.usersList.findIndex((user) => {
                    let result = false;
                    if (user.id === aUser.id) {
                         result = true;
                    }
                    return result;
                    _logger(indexOf);
               });
               if (indexOf > -1) {
                    pd.usersList[indexOf].statusType.id = 1;
                    pd.usersList[indexOf].statusType.name = "Active";
                    pd.userComponents = pd.usersList.map(mapUser);
               }
               return pd;
          });
     };

     const onActivateError = () => {
          AlertError();
     };

     const onParentToggleStatus = (aUser, statusId) => {
          if (statusId === 1) {
               userService
                    .onActivateClick({
                         id: aUser.id,
                         statusId: statusId,
                    })
                    .then((response) => onActivateSuccess(response, aUser))
                    .catch(onActivateError);
          } else if (statusId === 2) {
               userService
                    .onDeactivateClick({
                         id: aUser.id,
                         statusId: statusId,
                    })
                    .then((response) => onDeactivateSuccess(response, aUser))
                    .catch(onDeactivateError);
          }
     };

     const searchSuccess = (response) => {
          setPageData((prevState) => {
               const newList = { ...prevState };
               newList.usersList = response.item.pagedItems;
               newList.totalCount = response.item.totalCount;
               newList.pageIndex = newList.pageIndex;
               newList.userComponents = newList.usersList.map(mapUser);
               return newList;
          });
     };

     const searchError = () => {
          AlertError();
     };

     const onChangePage = (page) => {
          setPageData((prevState) => {
               const newList = { ...prevState };
               newList.pageIndex = page - 1;
               return newList;
          });
     };

     const onClickSearch = () => {
          setPageData((prevState) => {
               const newQueryObject = { ...prevState };
               newQueryObject.newQuerySearch = newQueryObject.query;
               newQueryObject.pageIndex = 0;
               return newQueryObject;
          });
     };

     const onFormFieldChange = (event) => {
          const query = event.target.value;
          setPageData((prevState) => {
               const newQueryObject = { ...prevState };
               newQueryObject[event.target.name] = query;
               return newQueryObject;
          });
     };

     return (
          <div className="container">
               <div className="row">
                    <div className="col-md-12 mb-3">
                         <div className="card user-admin-card2 cardheader col-sm-12">
                              <div className="row">
                                   <div className="col-lg-8 user-admin-custom-class">
                                        <h3 className="mt-3">Users List</h3>
                                   </div>
                              </div>

                              <div className="bg-holder d-none d-lg-block bg-card user-admin-bg-card">
                                   <div className="search-container user-admin-search-container">
                                        <div className="searchbar input-group input-group-med">
                                             <input
                                                  onChange={onFormFieldChange}
                                                  type="search"
                                                  name="query"
                                                  className="form-control"
                                                  placeholder="Search for Users"
                                             />
                                             <button
                                                  onClick={onClickSearch}
                                                  type="submit"
                                                  className="searchbutton  btn btn-primary"
                                             >
                                                  Search
                                             </button>
                                        </div>
                                   </div>
                                   <div className="row col-md-12 mb-3">
                                        <div className="d-flex justify-content-end">
                                             <Col xs="auto" className="p-0">
                                                  <Row className="g-2 align-items-center">
                                                       <Col xs="auto">
                                                            <OverlayTrigger
                                                                 placement="top"
                                                                 overlay={<Tooltip>User Grid</Tooltip>}
                                                            >
                                                                 <Link to="/userlist" className={`me-3`} id="grid-icon">
                                                                      <FontAwesomeIcon
                                                                           icon={faTh}
                                                                           transform="down-3"
                                                                           className="fs-1 icongrid user-admin-icongrid"
                                                                      />
                                                                 </Link>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger
                                                                 placement="top"
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
                                                                           className="fs-1 iconlist user-admin-iconlist hover-700"
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
                              <div className="row pagination2 mb-3 justify-content-center">
                                   {pageData.userComponents}
                                   <Pagination
                                        locale={locale}
                                        current={pageData.pageIndex + 1}
                                        total={pageData.totalCount}
                                        pageSize={pageData.pageSize}
                                        onChange={onChangePage}
                                        className="pagination user-admin-pagination mx-auto justify-content-center mb-5"
                                   />
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
export default UserList;
