import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import Swal from "sweetalert2";
import advertisementService from "services/advertisementService";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import sabioDebug from "sabio-debug";

const _logger = sabioDebug.extend("advertisement");
function AdvertisementsList() {
  const [tableData, setTableData] = useState({
    advertisementsList: [],
    advertisementsComponents: [],
    pageIndex: 0,
    pageSize: 5,
    totalCount: 0,
  });

  const AlertError = () => {
    Swal.fire(
      "Something went wrong!",
      "Click button again to revert back.",
      "error"
    );
  };

  useEffect(() => {
    _logger("use effect for list is working");
    advertisementService
      .advertisementGetAll(tableData.pageIndex, tableData.pageSize)
      .then(onGetAdvertisementsSuccess)
      .catch(onGetAdvertisementsError);
  }, [tableData.pageIndex, tableData.pageSize, tableData.query]);

  const onGetAdvertisementsSuccess = (response) => {
    _logger(response);
    setTableData((prevState) => {
      const newTable = { ...prevState };
      newTable.advertisementsList = response.item.pagedItems;
      newTable.totalCount = response.item.totalCount;
      return newTable;
    });
  };

  const onGetAdvertisementsError = () => {
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
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-3">
            <div className="card advertisement-card3 cardheader col-sm-12 pb-1">
              <div className="row">
                <div className="col-lg-8 advertisement-custom-class2">
                  <h3 className="mt-4">Advertisements List Table</h3>
                </div>
              </div>
              <div className="row col-md-12 mb-3">
                <div className="d-flex justify-content-end">
                  <Col xs="auto" className="p-0">
                    <Row className="g-2 align-items-center">
                      <Col xs="auto">
                        <OverlayTrigger
                          placement="top"
                          className="tooltip"
                          overlay={<Tooltip>Advertisement List</Tooltip>}
                        >
                          <Link
                            to="/advertisements/list"
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
              <div className="row">
                <div className="bg-holder d-none d-lg-block bg-card advertisement-bg-card1 mt-4">
                  <div id="tableExample3"></div>
                  <div className="row justify-content-end g-0 mt-8">
                    <div className="col-auto col-sm-5 mb-3">
                      <form>
                        <div className="input-group">
                          <input
                            className="form-control form-control-sm shadow-none search"
                            type="search"
                            name="query"
                            placeholder="Search by Owner"
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
                            <th className="sort" data-sort="title">
                              Title
                            </th>
                            <th className="sort" data-sort="details">
                              Details
                            </th>
                            <th className="sort" data-sort="dateStart">
                              Date Start
                            </th>
                            <th className="sort" data-sort="dateEnd">
                              Date End
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list bg-300">
                          {tableData.advertisementsList.map((ad) => (
                            <tr key={ad.id}>
                              <td>{`${ad.title}`}</td>
                              <td>{ad.details}</td>
                              <td>
                                <div>{ad.dateStart}</div>
                              </td>
                              <td>{ad.dateEnd}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <Link to="/advertisements/form">
                    <button
                      className="btn btn-primary newAdvertisement-me-auto mt-2"
                      type="button"
                      id="newAdvertisement"
                    >
                      Make New Advertisement
                    </button>
                  </Link>
                  <div className="row">
                    <div className="col-md-12 pagination-col">
                      <div className="row pagination3 mb-3 justify-content-center">
                        {tableData.advertisementsComponents}
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
    </React.Fragment>
  );
}
export default AdvertisementsList;
