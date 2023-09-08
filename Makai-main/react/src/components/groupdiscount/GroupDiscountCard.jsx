import React, { useState } from "react";
import { Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Card, Row } from "react-bootstrap";
import { CardBody, CardSubtitle } from "reactstrap";
import { useNavigate } from "react-router-dom";
import * as groupDiscountService from "../../services/groupDiscountService";
import debug from "sabio-debug";
import toastr from "toastr";
import { formatDateInput } from "../../utils/dateFormater";
import PropTypes from "prop-types";
import "./groupdiscount.css";
import Swal from "sweetalert2";

const _logger = debug.extend("GroupDiscount");

function GroupDiscountCard(prop) {
  const aDiscount = prop.discount;

  const onCardEdit = () => {
    const editState = { state: { type: "discountEdit", payload: aDiscount } };
    navigate(`/groupdiscounts/${aDiscount.id}/form`, editState);
  };

  const startDate = formatDateInput(aDiscount.startDate);
  const endDate = formatDateInput(aDiscount.endDate);
  const [isDeleted, setIsDeleted] = useState(aDiscount.isDeleted);
  const [isActive, setIsActive] = useState(aDiscount.isActive);

  const onCardDelete = (e) => {
    _logger("target", e.target.name);
    Swal.fire({
      title: "Do you want to delete this discount?",
      showDenyButton: true,
      confirmButtonText: "YES",
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        groupDiscountService
          .deleteDiscount(true, aDiscount.id)
          .then(onDeleteSuccess)
          .catch(onDeleteError);
      } else if (result.isDenied) {
        toastr.error("The discount was not deleted");
      }
    });
  };

  const onCardActivate = (e) => {
    _logger("target", e.target.name);
    if (e.target.name === "activate") {
      groupDiscountService
        .activeDiscount(true, aDiscount.id)
        .then(onActivateSuccess)
        .catch(onActivateError);
    } else if (e.target.name === "deactivate") {
      groupDiscountService
        .activeDiscount(false, aDiscount.id)
        .then(onDisactivatedSuccess)
        .catch(onDisactivatedError);
    }
  };
  const onActivateSuccess = () => {
    setIsActive(!isActive);
    toastr.success("the Discount was activated");
    prop.onActivateSuccess(aDiscount.id);
  };
  const onActivateError = () => {
    setIsActive(!isActive);
    toastr.error("the Discount was not activated");
  };
  const onDisactivatedSuccess = () => {
    setIsActive(!isActive);
    toastr.success("the Discount was disactivated");
    prop.onActivateSuccess(aDiscount.id);
  };
  const onDisactivatedError = () => {
    toastr.error("The Discount was not disactivated");
  };

  const onDeleteSuccess = () => {
    setIsDeleted(!isDeleted);
    toastr.success("the Discount was Deleted");
    prop.onDeleteSuccess(aDiscount.id);
  };
  const onDeleteError = () => {
    toastr.error("The Discount was not Deleted");
  };
  const navigate = useNavigate();

  return (
    <Card className="mb-3  text-center ">
      <Row className="bg-dark  border  rounded-top border-white group-discount-row">
        <Card.Title>
          <div className="mt-3  text-white">{aDiscount.name}</div>
          {!isActive && (
            <span className="   text-white fw-light">Discount Disabled</span>
          )}
        </Card.Title>
      </Row>
      <Row>
        <figcaption className="font-weight-light">
          {aDiscount.discountType.name} Discount
        </figcaption>

        <CardSubtitle className=" mt-3 ">
          <span className="p-1 rounded bg-secondary text-white">
            {" "}
            Value : $ {aDiscount.value}
          </span>
        </CardSubtitle>

        <CardBody>
          <div>{aDiscount.description}</div>
        </CardBody>
      </Row>

      <Row className="text-center">
        <Col>
          <Button
            className="btn btn-dark border-white m-2 btn-sm"
            onClick={onCardEdit}
            type="button"
          >
            Edit Discount
          </Button>
        </Col>
        <Col>
          {isDeleted === false && (
            <Button
              className="btn btn-danger border-white  m-2 btn-sm"
              onClick={onCardDelete}
              name="delete"
              type="button"
            >
              Delete Discount
            </Button>
          )}
        </Col>
        <Col>
          {isActive === false ? (
            <Button
              className="btn btn-success border-white  m-2 btn-sm"
              onClick={onCardActivate}
              name="activate"
              type="button"
            >
              Activate Discount
            </Button>
          ) : (
            <Button
              className="btn btn-secondary  m-2 btn-sm"
              onClick={onCardActivate}
              name="deactivate"
              type="button"
            >
              Disable Discount
            </Button>
          )}
        </Col>
      </Row>
      <Col>
        <Row className="bg-dark  border  rounded-bottom border-white group-discount-row">
          <p className="card-text m-1 text-white">
            <small className="m-2">Start Date : {startDate}</small>
            <small className="m-2">End Date : {endDate}</small>
          </p>
        </Row>
      </Col>
    </Card>
  );
}

GroupDiscountCard.propTypes = {
  discount: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    discountType: PropTypes.shape({ name: PropTypes.string }),
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }).isRequired,
  onDeleteSuccess: PropTypes.func,
  onActivateSuccess: PropTypes.func,
};

export default GroupDiscountCard;
