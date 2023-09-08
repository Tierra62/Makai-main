import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import emergencyContactService from "../../services/emergencyContactService.js";
import CardDropdown from "components/common/CardDropdown";
import { Dropdown, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import toastr from "toastr";
import "toastr/build/toastr.css";
import { useNavigate } from "react-router-dom";
import * as dateFormatter from "../../utils/dateFormater.js";
import "./emergencyContact.css";

const _logger = debug.extend("EmergencyContactSysAdminViewUserEntry");

function EmergencyContactSysAdminViewUserEntry(props) {
  const navigate = useNavigate();

  const [lookUpState, setLookUpState] = useState({
    statusType: props.user.statusType,
    statusTypeName: props.user.statusType.name,
    val: props.user.statusType.name,
    classNameOfVal: "",
  });

  const colorCodeStatusType = (statusType) => {
    const statusTypeName = statusType.name;
    let className = "";
    switch (statusTypeName) {
      case "Active":
        className = "text-success";
        break;
      case "Inactive":
        className = "text-muted";
        break;
      case "Flagged":
        className = "text-danger";
        break;
      case "Pending":
        className = "text-warning";
        break;
      default:
        className = "text-info";
        break;
    }
    className += " text-12";
    return className;
  };

  const colorCodeStatusTypeName = (statusTypeName) => {
    let className = "";
    switch (statusTypeName) {
      case "Active":
        className = "text-success";
        break;
      case "Inactive":
        className = "text-muted";
        break;
      case "Flagged":
        className = "text-danger";
        break;
      case "Pending":
        className = "text-warning";
        break;
      default:
        className = "text-info";
        break;
    }
    className += " text-12";
    return className;
  };

  useEffect(() => {
    props.statusTypes &&
      setLookUpState((prevState) => {
        const newState = { ...prevState };
        newState.classNameOfVal = colorCodeStatusTypeName(newState.val);
        return newState;
      });
  }, [props.statusTypes]);

  const dateOfBirth = dateFormatter.formatDateInput(props.user.dob);

  const findUserRoles = (roles) => {
    let stringedListOfUserRoles = "";
    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        const userRole = roles[i].name;
        stringedListOfUserRoles += userRole + " ";
      }
    }
    return stringedListOfUserRoles.slice(0, stringedListOfUserRoles.length - 1);
  };

  const userRoles = findUserRoles(props.user.roles);

  const onViewClicked = (evt) => {
    _logger(evt);
    emergencyContactService
      .getByUserIdPaginated(0, 5, props.user.id)
      .then(onGetByUserIdPaginatedSuccess)
      .catch(onGetByUserIdPaginatedError);
  };

  const onGetByUserIdPaginatedSuccess = (data) => {
    _logger(data);
    const stateToCarryOver = {
      type: "userId",
      payload: { id: data.item.pagedItems[0].userInfo.id },
    };
    navigate("/emergency/contact/admin/users/view/user/emergencycontacts", {
      state: stateToCarryOver,
    });
  };

  const onGetByUserIdPaginatedError = (err) => {
    _logger(err);
    const errString = String(err);
    if (
      errString.slice(errString.length - 3, errString.length) === String(404)
    ) {
      toastr.info(
        "No emergency contacts to display!",
        "User has no emergency contacts"
      );
    } else {
      toastr.error(
        "Error finding user's emergency contacts!",
        "Try reloading the page and trying again"
      );
    }
  };

  const changeStatus = (statusTypeName, userId) => {
    let idxOfStatusTypeName = props.statusTypes.findIndex((statusType) => {
      return statusType.name === statusTypeName;
    });
    const statusTypeId = props.statusTypes[idxOfStatusTypeName].id;
    let payload = {
      id: userId,
      statusId: statusTypeId,
    };
    props.renderChangeToStatus(payload);
  };

  const mapSelectOptions = (statusType) => {
    const colorClassName = colorCodeStatusType(statusType);
    const uniqueKey =
      "user-" + props.user.id + "&" + "statusType-" + statusType?.id;
    return (
      <option
        key={uniqueKey}
        value={statusType?.name}
        className={colorClassName}
      >
        {statusType?.name}
      </option>
    );
  };

  return (
    <tr>
      <td scope="col">
        <img
          className="rounded-circle img-fluid img-hw-equalizer"
          src={
            props.user?.avatarUrl === null
              ? "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=6&m=1223671392&s=612x612&w=0&h=NGxdexflb9EyQchqjQP0m6wYucJBYLfu46KCLNMHZYM="
              : props.user?.avatarUrl
          }
        />
      </td>
      <td scope="col">{props.user.lastName}</td>
      <td scope="col">{props.user.firstName}</td>
      <td scope="col">{props.user?.mi}</td>
      <td scope="col">{props.user.email}</td>
      <td scope="col">{dateOfBirth}</td>
      <td scope="col">{userRoles}</td>
      <td scope="col" className="font-weight-bold">
        <Form.Select
          onChange={(evt) => {
            _logger(evt);
            _logger(evt.target.value);
            setLookUpState((prevState) => {
              const newState = { ...prevState };
              newState.val = evt.target.value;
              newState.classNameOfVal = colorCodeStatusTypeName(newState.val);
              return newState;
            });
            changeStatus(evt.target.value, props.user.id);
          }}
          value={lookUpState.val}
          className={lookUpState.classNameOfVal}
        >
          {props.statusTypes && props.statusTypes.map(mapSelectOptions)}
        </Form.Select>
      </td>
      <td className="text-end">
        <CardDropdown>
          <div className="py-2">
            <Dropdown.Item onClick={onViewClicked}>
              View Emergency Contacts
            </Dropdown.Item>
          </div>
        </CardDropdown>
      </td>
    </tr>
  );
}

EmergencyContactSysAdminViewUserEntry.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    avatarUrl: PropTypes.string,
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
  }).isRequired,
  statusTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  renderChangeToStatus: PropTypes.func.isRequired,
};

export default EmergencyContactSysAdminViewUserEntry;
