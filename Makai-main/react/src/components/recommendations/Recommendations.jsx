import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import debug from "sabio-debug";

const _logger = debug.extend("Recomm");
_logger("starting");

function Recommendations() {
  return (
    <React.Fragment>
      <div className="container d-flex justify-content-center mt-5">
        <div className="bg-1000 border card w-75">
          <div className="col mt-2 text-center">
            <h1 className="mt-2 text-center text-white">Recommendations</h1>

            <div className="row p-2">
              <div className="col p-4 m-4">
                <Button
                  as={Link}
                  variant="outline-light"
                  className="mt-2 px-4"
                  to="/recommendations/new"
                >
                  Submit new recommendation
                </Button>
              </div>
              <div className="col p-4 m-4">
                <Button
                  as={Link}
                  variant="outline-light"
                  className="mt-2 px-4"
                  to="/recommendations/view"
                >
                  View recommendations
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

Recommendations.propTypes = {
  hasLabel: PropTypes.bool,
};

export default Recommendations;
