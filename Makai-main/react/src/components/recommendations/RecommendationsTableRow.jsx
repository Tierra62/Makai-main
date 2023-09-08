import React from "react";
import { Button } from "react-bootstrap";
import debug from "sabio-debug";
import { BiAdjust } from "react-icons/bi";
import { BiBlock } from "react-icons/bi";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Badge from "react-bootstrap/Badge";

const _logger = debug.extend("Table");

function RecommendationsTableRow(props) {
  //Only the mapped element is coming here.
  const recommItem = props.recommendation;
  const sourceProduct = props.recommendation.sourceProductId;
  const targetProduct = props.recommendation.targetProductId;

  const onLocalActiveButton = (e) => {
    Swal.fire({
      title: `Are you sure you want to ${
        props.recommendation.isActive ? "deactivate" : "activate"
      } this recommendation?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        _logger("isActive button firing in component");
        props.onRecommendationIsActiveClick(
          props.recommendation.id,
          props.recommendation.isActive,
          e
        );
        Swal.fire("updated!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const onLocalDeleteButton = (e) => {
    Swal.fire({
      title: `Are you sure you want to ${
        props.recommendation.isDeleted ? "add" : "delete"
      } this recommendation?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        _logger(
          "isDeleted button firing in component",
          props.recommendation.id
        );
        props.onRecommendationIsDeletedClick(
          props.recommendation.id,
          props.recommendation.isDeleted,
          e
        );
        Swal.fire("updated!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const renderActions = () => {
    return (
      <div className="d-inline-block">
        <Button
          variant="light"
          size="sm"
          className="border-300 btn btn-light m-1 w-100"
          name="onLocalActiveButton"
          onClick={onLocalActiveButton}
        >
          Toggle Active <BiAdjust />
        </Button>
        <Button
          variant="light"
          size="sm"
          className="border-300 btn btn-light m-1 w-100"
          name="onLocalDeleteButton"
          onClick={onLocalDeleteButton}
        >
          Toggle Deleted <BiBlock />
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <tr className="hover-actions-trigger">
        <td className="d-none">{recommItem.id}</td>
        <td>{recommItem.partnerId.name}</td>
        <td>{sourceProduct.name}</td>
        <td>{sourceProduct.standId}</td>
        <td>{(sourceProduct.hourlyPriceInCents / 100).toFixed(2)}</td>
        <td>{targetProduct.name}</td>
        <td>{targetProduct.standId}</td>
        <td>{(targetProduct.hourlyPriceInCents / 100).toFixed(2)}</td>
        <td>{recommItem.reason}</td>
        <td>
          {recommItem.isActive ? (
            <Badge pill bg="success">
              Active
            </Badge>
          ) : (
            <Badge pill bg="danger">
              Inactive
            </Badge>
          )}
        </td>
        <td>
          {recommItem.isDeleted ? (
            <Badge pill bg="danger">
              Deleted
            </Badge>
          ) : (
            <Badge pill bg="success">
              Not deleted
            </Badge>
          )}
        </td>
        <td>{renderActions()}</td>
        <td className="w-auto"></td>
      </tr>
    </React.Fragment>
  );
}

RecommendationsTableRow.propTypes = {
  recommendation: PropTypes.shape({
    id: PropTypes.number.isRequired,
    partnerId: PropTypes.number.isRequired,

    sourceProductId: PropTypes.number.isRequired,
    targetProductId: PropTypes.number.isRequired,
    reason: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    isDeleted: PropTypes.bool.isRequired,
  }),
  onRecommendationIsActiveClick: PropTypes.func.isRequired,
  onRecommendationIsDeletedClick: PropTypes.func.isRequired,
};

export default RecommendationsTableRow;
