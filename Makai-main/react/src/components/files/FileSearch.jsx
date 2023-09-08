import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useState } from "react";
import PropTypes from "prop-types";

function FileSearch(props) {
  const [searchItem, setSearchItem] = useState();

  const onSearchBoxChange = (e) => {
    setSearchItem(e.target.value);
  };

  const onSearchClick = () => {
    props.searchHandler(searchItem);
  };

  return (
    <Container>
      <Row className="p-2 mt-2">
        <Col className="search-box mb-1  ms-1 w-95 text-left">
          <input
            type="text"
            className="form-control"
            aria-label="Default"
            placeholder="Search"
            aria-describedby="inputGroup-sizing-default"
            onChange={onSearchBoxChange}
          />
        </Col>
        <Col lg={4}>
          <button
            type="button px-1"
            className="btn btn-secondary"
            onClick={onSearchClick}
          >
            Search
          </button>
        </Col>
      </Row>
    </Container>
  );
}

FileSearch.propTypes = {
  searchHandler: PropTypes.func.isRequired,
};

export default FileSearch;
