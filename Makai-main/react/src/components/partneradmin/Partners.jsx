import React, { useEffect, useState } from "react";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import { Col, Container, Row, Table, Card } from "react-bootstrap";
import PartnerTableRow from "./PartnerTableRow";
import Flex from "components/common/Flex";
import * as partnerService from "../../services/partnerService";
import "rc-pagination/assets/index.css";

const _logger = debug.extend("partners");

const Partners = () => {
  const [partnerData, setPartnerData] = useState({
    partnerArray: [],
    partnerComponents: [],
    page: 1,
    pageSize: 8,
    totalCount: 0,
    searchQuery: "",
  });

  useEffect(() => {
    if (partnerData.searchQuery) {
      partnerService
        .searchPartners(
          partnerData.page - 1,
          partnerData.pageSize,
          partnerData.searchQuery
        )
        .then(onGetPartnersSuccess)
        .catch(onGetPartnersError);
    } else {
      partnerService
        .getAllPartners(partnerData.page - 1, partnerData.pageSize)
        .then(onGetPartnersSuccess)
        .catch(onGetPartnersError);
    }
  }, [partnerData.page, partnerData.pageSize, partnerData.searchQuery]);

  const onGetPartnersSuccess = (data) => {
    _logger(data);
    let newPartnerArr = data.item.pagedItems;
    const totalCount = data.item.totalCount;

    setPartnerData((prevState) => {
      const partnerData = { ...prevState };
      partnerData.totalCount = totalCount;
      partnerData.partnerArray = newPartnerArr;
      partnerData.partnerComponents = newPartnerArr.map(mapTable);
      return partnerData;
    });
  };

  const onGetPartnersError = (error) => {
    _logger(error, "data error");
  };

  const mapTable = (partner) => {
    return <PartnerTableRow partner={partner} key={`List ${partner.id}`} />;
  };

  const onChange = (page) => {
    _logger("onChange");
    setPartnerData((prevState) => {
      const partnerData = { ...prevState };
      partnerData.page = page;
      return partnerData;
    });
  };

  const handleSearch = (e) => {
    const target = e.target;
    const newValue = target.value;
    setPartnerData((prevState) => {
      const newSearchObject = { ...prevState };
      newSearchObject.searchQuery = newValue;
      return newSearchObject;
    });
  };

  return (
    <React.Fragment>
      <Container>
        <Card>
          <h2 className="mt-3 text-center">Partners Manager</h2>
          <Row>
            <Col>
              <div className="card flex">
                <div className="card-body">
                  <Flex justifyContent="space-between" alignItems="end">
                    <Col>
                      <Pagination
                        className="mt-3 mb-3"
                        onChange={onChange}
                        current={partnerData.page}
                        total={partnerData.totalCount}
                        pageSize={partnerData.pageSize}
                      />
                    </Col>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Search Partners Here"
                          aria-describedby="button-addon2"
                          onChange={handleSearch}
                          value={partnerData.searchQuery}
                        />
                      </div>
                    </div>
                  </Flex>
                  <div className="table-responsive">
                    <Table className="table table-bordered table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th className="border-0">Logo</th>
                          <th className="border-0">Business Name & Website</th>
                          <th className="border-0">Phone Number</th>
                          <th className="border-0">Stand Id</th>
                          <th className="border-0">Members</th>
                          <th className="border-0">Stand Status</th>
                        </tr>
                      </thead>
                      <tbody>{partnerData.partnerComponents}</tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default Partners;
