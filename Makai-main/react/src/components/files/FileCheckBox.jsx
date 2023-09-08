import React from "react";
import { Container, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import debug from "sabio-debug";
const _logger = debug.extend("Files");

function FileCheckBox(props) {
  const [filters, setFilters] = useState([]);

  const onLocalShowDeletedClick = () => {
    props.showDeleteHandler();
  };

  const onLocalShowAllClick = () => {
    props.showAllHandler();
  };

  const onLocalApplyFiltersClick = () => {
    props.filterHandler(filters);
  };

  const onCheckBoxChange = (event) => {
    let checkVal = event.target.value;
    setFilters((prevState) => {
      const newState = [...prevState];
      if (newState.includes(checkVal)) {
        const indexOf = newState.findIndex((valId) => {
          _logger("valId:", valId);
          _logger("checkVal:", checkVal);
          let result = false;
          if (valId === checkVal) {
            result = true;
          }
          return result;
        });

        _logger("indexOf:", indexOf);
        if (indexOf >= 0) {
          newState.splice(indexOf, 1);
        }
      } else {
        newState.push(event.target.value);
      }

      _logger("newState:", newState);
      return newState;
    });
    false && filters;
  };

  return (
    <React.Fragment>
      <Container fluid>
        <div className="container bg-white rounded text-start">
          <p className="fw-bold ms-3 pt-2 bg-light">Select file type:</p>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="PDF"
              value="1"
              onChange={onCheckBoxChange}
              id="PDFcheck"
            />
            <label className="form-check-label" htmlFor="PDFcheck">
              PDF
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="PNG"
              onChange={onCheckBoxChange}
              value="8"
              id="PNGcheck"
            />
            <label className="form-check-label" htmlFor="PNGcheck">
              PNG
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="TIFF"
              onChange={onCheckBoxChange}
              value="6"
              id="TIFFcheck"
            />
            <label className="form-check-label" htmlFor="TIFFcheck">
              TIFF
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="BMP"
              onChange={onCheckBoxChange}
              value="19"
              id="BMPcheck"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              BMP
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="JPG"
              value="7"
              onChange={onCheckBoxChange}
              id="JPGcheck"
            />
            <label className="form-check-label" htmlFor="JPGcheck">
              JPG
            </label>
          </div>
          <Row className="w-75 align-left">
            <button
              type="button"
              className="btn btn-secondary mx-5 mb-2"
              onClick={onLocalApplyFiltersClick}
            >
              Apply filters
            </button>
            <button
              type="button"
              className="btn btn-secondary mx-5 mb-2"
              onClick={onLocalShowDeletedClick}
            >
              Show deleted files
            </button>
            <button
              type="button"
              className="btn btn-secondary mx-5 mb-2"
              onClick={onLocalShowAllClick}
            >
              Show active files
            </button>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
}

FileCheckBox.propTypes = {
  filterHandler: PropTypes.func.isRequired,
  showDeleteHandler: PropTypes.func.isRequired,
  showAllHandler: PropTypes.func.isRequired,
};

export default FileCheckBox;
