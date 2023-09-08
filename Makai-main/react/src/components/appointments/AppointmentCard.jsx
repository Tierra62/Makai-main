import React, { useEffect, useState } from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import * as dateFormatter from "../../utils/dateFormater.js";
import toastr from "toastr";
import "toastr/build/toastr.css";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import * as appointmentsService from "../../services/appointmentsService.js";
import moment from "moment-timezone";

const _logger = debug.extend("AppointmentCard");

function AppointmentCard(props) {
  const [cardState, setCardState] = useState({
    appts: [],
    formState: {
      phone: props.appointment.phone ? props.appointment.phone : "",
      startDateTime: props.appointment.startDateTime,
      time: props.appointment.time,
      id: props.appointment.id,
    },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormatted: moment
      .utc(props.appointment.startDateTime, moment.ISO_8601)
      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
      .format("MM/DD/YYYY HH:mm"),
    isNavigating: false,
    isEditing: true,
  });

  useEffect(() => {
    if (cardState.isNavigating === true) {
      navigateToEditPage();
    }
  }, [cardState.appts]);

  const navigate = useNavigate();
  const currentUnixTime = new Date().getTime();
  const apptUnixTime = new Date(props.appointment.startDateTime).getTime();
  const user = props.appointment.createdBy;
  const fullName = `${user.firstName} ${user.mi}. ${user.lastName}`;
  let phoneFormatted = "N/A";
  if (props.appointment.phone && props.appointment.phone.length === 10) {
    phoneFormatted = `(${props.appointment.phone.slice(
      0,
      3
    )})${props.appointment.phone.slice(3, 6)}-${props.appointment.phone.slice(
      6,
      10
    )}`;
  }

  const onClickedEdit = (evt) => {
    _logger(evt);
    swal({
      title: "Are you sure you want to edit the details of this appointment?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "btn-success btn",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "btn-danger btn",
          closeModal: true,
        },
      },
    }).then((willEdit) => {
      if (willEdit) {
        getAppointmentTimes();
      } else {
        swal("Edit cancelled...");
      }
    });
  };

  const navigateToEditPage = () => {
    const stateToCarryOver = { type: "appointment", payload: cardState };
    navigate("/appointments/form", { state: stateToCarryOver });
  };

  const onGetAllSuccess = (data) => {
    setCardState((prevState) => {
      const newState = { ...prevState };
      newState.appts = data.items.map(mapTimeZoneToAppt);
      newState.isNavigating = true;
      return newState;
    });
  };

  const mapTimeZoneToAppt = (appt) => {
    const offsetInMinutes = -Number(moment(appt.startDateTime).utcOffset());
    const offsetStartDateTime = moment(appt.startDateTime)
      .subtract(offsetInMinutes, "minutes")
      .format("MM/DD/YYYY HH:mm");
    appt.startDateTime = offsetStartDateTime;
    return appt;
  };

  const onGetAllError = (err) => {
    _logger(`error: ${err}`);
    toastr.error("Error: try reloading page...");
  };

  const getAppointmentTimes = () => {
    appointmentsService.getAll().then(onGetAllSuccess).catch(onGetAllError);
  };

  const onClickedConfirmAppt = (evt) => {
    _logger(evt);
    let notIsConfirmed = !props.appointment.isConfirmed;
    if (props.appointment.isConfirmed) {
      swal({
        title: "Unconfirm this appointment?",
        icon: "warning",
        buttons: {
          confirm: {
            text: "Yes",
            value: true,
            visible: true,
            className: "btn-success btn",
            closeModal: true,
          },
          cancel: {
            text: "No",
            value: false,
            visible: true,
            className: "btn-danger btn",
            closeModal: true,
          },
        },
      }).then((willUnconfirm) => {
        if (willUnconfirm) {
          const payload = {
            id: props.appointment.id,
            isConfirmed: notIsConfirmed,
          };
          props.confirmClicked(payload);
        } else {
          swal("Appointment remains confirmed!");
        }
      });
    } else {
      swal({
        title: "Confirm this appointment?",
        icon: "warning",
        buttons: {
          confirm: {
            text: "Yes",
            value: true,
            visible: true,
            className: "btn-success btn",
            closeModal: true,
          },
          cancel: {
            text: "No",
            value: false,
            visible: true,
            className: "btn-danger btn",
            closeModal: true,
          },
        },
      }).then((willConfirm) => {
        if (willConfirm) {
          const payload = {
            id: props.appointment.id,
            isConfirmed: notIsConfirmed,
          };
          props.confirmClicked(payload);
        } else {
          swal("Appointment remains unconfirmed...");
        }
      });
    }
  };

  const onClickedCancelAppt = (evt) => {
    _logger(evt);
    swal({
      title: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "btn-success btn",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "btn-danger btn",
          closeModal: true,
        },
      },
    }).then((willCancel) => {
      if (willCancel) {
        props.cancelClicked(props.appointment.id);
      } else {
        swal("Appointment remains as scheduled...");
      }
    });
  };

  return (
    <Card style={{ width: "15rem" }} className="m-3 d-flex">
      <Card.Img
        src={
          user.avatarUrl
            ? user.avatarUrl
            : "https://cdn2.vectorstock.com/i/1000x1000/23/81/default-avatar-profile-icon-vector-18942381.jpg"
        }
        variant="top"
        className="img-thumbnail"
      />
      <Card.Body>
        <Card.Title>{fullName}</Card.Title>
        <Card.Text>{cardState.dateFormatted}</Card.Text>
        <Card.Text>
          Length: {dateFormatter.stringifyTime(props.appointment.time)}
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem>Ph#: {phoneFormatted}</ListGroupItem>
        <ListGroupItem
          className={
            props.appointment.isConfirmed === true
              ? "text-success"
              : "text-warning"
          }
        >
          {props.appointment.isConfirmed === true
            ? "Confirmed"
            : "Not Confirmed"}
        </ListGroupItem>
        <ListGroupItem
          className={
            props.appointment.isCancelled === true
              ? "text-danger"
              : "text-success"
          }
        >
          {props.appointment.isCancelled === true
            ? "Cancelled"
            : "Not Cancelled"}
        </ListGroupItem>
        <Card.Body>
          <div className="col text-center">
            <button
              className={
                currentUnixTime > apptUnixTime ||
                props.appointment.isCancelled === true
                  ? "btn btn-primary ms-2 mb-2 d-none"
                  : props.appointment.isConfirmed === true
                  ? "btn btn-info ms-2 mb-2"
                  : "btn btn-primary ms-2 mb-2"
              }
              onClick={onClickedConfirmAppt}
            >
              {props.appointment.isConfirmed === true ? "Unconfirm" : "Confirm"}
            </button>
          </div>
          <div className="btn-group">
            <button
              className={
                props.appointment.isCancelled === true ||
                currentUnixTime > apptUnixTime
                  ? "btn btn-danger d-none"
                  : "btn btn-danger"
              }
              onClick={onClickedCancelAppt}
            >
              Cancel
            </button>
            <button
              className={
                props.appointment.isCancelled === true ||
                currentUnixTime > apptUnixTime
                  ? "btn btn-success ms-2 d-none"
                  : "btn btn-success ms-2"
              }
              onClick={onClickedEdit}
            >
              Edit
            </button>
          </div>
        </Card.Body>
      </ListGroup>
    </Card>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    phone: PropTypes.string,
    startDateTime: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    isConfirmed: PropTypes.bool.isRequired,
    isCancelled: PropTypes.bool.isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    modifiedBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
    }),
    createdBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
    }),
  }).isRequired,
  cancelClicked: PropTypes.func.isRequired,
  confirmClicked: PropTypes.func.isRequired,
};

export default AppointmentCard;
