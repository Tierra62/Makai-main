import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import * as appointmentsService from "../../services/appointmentsService.js";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import AppointmentCard from "./AppointmentCard.jsx";
import toastr from "toastr";
import "toastr/build/toastr.css";
import swal from "sweetalert";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("Appointments");

function Appointment() {
  const navigate = useNavigate();
  const [apptState, setApptState] = useState({
    arrayOfAppointments: [],
    arrayOfAppointmentsComponents: [],
    totalNumAppointments: 0,
    show: false,
    page: {
      current: 1,
      currentIndex: 0,
    },
  });

  useEffect(() => {
    getAllAppointments();
  }, [apptState.page.currentIndex]);

  const onPageChange = (newPage) => {
    _logger(`current page: ${apptState.page.current}`);
    _logger(`changing page.current to: ${newPage}`);

    setApptState((prevState) => {
      const newState = { ...prevState };
      newState.page.current = newPage;
      newState.page.currentIndex = newPage - 1;
      return newState;
    });
  };

  const getAllAppointments = () => {
    _logger("getAllAppointments firing...");
    _logger(`current page: ${apptState.page.current}`);

    appointmentsService
      .getAppointmentsByUserId(apptState.page.currentIndex, 12)
      .then(onGetAllAppointmentsByUserIdSuccess)
      .catch(onGetAllAppointmentsByUserIdError);
  };

  const onGetAllAppointmentsByUserIdSuccess = (data) => {
    _logger("onGetAllAppointmentsByUserIdSuccess firing...");
    _logger(data);
    _logger(`total number of appointments: ${data.item.totalCount}`);

    setApptState((prevState) => {
      const newState = { ...prevState };
      newState.totalNumAppointments = Math.floor(
        (data.item.totalCount * 10) / 12
      );
      newState.arrayOfAppointments = data.item.pagedItems;
      newState.arrayOfAppointmentsComponents =
        newState.arrayOfAppointments.map(mapAppointment);
      if (!newState.show) {
        newState.show = true;
      }
      return newState;
    });
  };

  const onGetAllAppointmentsByUserIdError = (err) => {
    _logger("onGetAllAppointmentsByUserIdError firing...");
    _logger(err);
    toastr.error(
      "Retrieval of Appointments Unsuccessful! Try reloading the page or logging in again...",
      `${err}`
    );
  };

  const onCancelAppointmentByIdSuccess = (idAppointment) => {
    _logger(
      `onCancelAppointmentByIdSuccess firing...for idAppointment: ${idAppointment}`
    );

    setApptState((prevState) => {
      const newState = { ...prevState };

      const idxOfAppointment = newState.arrayOfAppointments.findIndex(
        (appointment) => {
          return appointment.id === idAppointment;
        }
      );
      _logger(`idxOfAppointment: ${idxOfAppointment}`);

      newState.arrayOfAppointments[idxOfAppointment] = {
        ...prevState.arrayOfAppointments[idxOfAppointment],
      };
      newState.arrayOfAppointmentsComponents[idxOfAppointment] = {
        ...prevState.arrayOfAppointmentsComponents[idxOfAppointment],
      };

      newState.arrayOfAppointments[idxOfAppointment].isCancelled = true;
      newState.arrayOfAppointmentsComponents[idxOfAppointment] = mapAppointment(
        newState.arrayOfAppointments[idxOfAppointment]
      );
      return newState;
    });
    swal("Appointment cancelled!", {
      icon: "success",
    });
  };

  const onClickedCancel = (appointmentId) => {
    _logger(`onClickedCancel firing...for appointmentId: ${appointmentId}`);

    appointmentsService
      .cancelAppointmentById(appointmentId)
      .then(onCancelAppointmentByIdSuccess(appointmentId))
      .catch(onCancelAppointmentByIdError);
  };

  const onCancelAppointmentByIdError = (err) => {
    _logger("onCancelAppointmentByIdError firing...");
    _logger(err);
  };

  const onConfirmAppointmentByIdSuccess = (response) => {
    const payload = JSON.parse(response.config.data);
    _logger(
      `onConfirmAppointmentByIdSuccess firing...with payload: ${payload}`
    );

    setApptState((prevState) => {
      const newState = { ...prevState };
      let returnNewState = false;

      const idxOfAppointment = newState.arrayOfAppointments.findIndex(
        (appointment) => {
          return appointment.id === payload.id;
        }
      );
      _logger(
        `idxOfAppointment: ${idxOfAppointment}`,
        `isConfirmed to be changed to: ${payload.isConfirmed}`
      );

      newState.arrayOfAppointments[idxOfAppointment] = {
        ...prevState.arrayOfAppointments[idxOfAppointment],
      };
      newState.arrayOfAppointmentsComponents[idxOfAppointment] = {
        ...prevState.arrayOfAppointmentsComponents[idxOfAppointment],
      };

      if (
        payload.isConfirmed !==
        prevState.arrayOfAppointments[idxOfAppointment].isConfirmed
      ) {
        _logger("changing isConfirmed");
        newState.arrayOfAppointments[idxOfAppointment].isConfirmed =
          payload.isConfirmed;
        newState.arrayOfAppointmentsComponents[idxOfAppointment] =
          mapAppointment(newState.arrayOfAppointments[idxOfAppointment]);
        returnNewState = true;
      }

      if (returnNewState) {
        return newState;
      } else {
        return prevState;
      }
    });
  };

  const onClickedConfirm = (payload) => {
    _logger(`onClickedConfirm firing...for appointmentId: ${payload.id}`);

    appointmentsService
      .updateIsConfirmedById(payload)
      .then(onConfirmAppointmentByIdSuccess)
      .catch(onConfirmAppointmentByIdError);
  };

  const onConfirmAppointmentByIdError = (err) => {
    _logger("onConfirmAppointmentByIdError firing...");
    _logger(err);
  };

  const mapAppointment = (anAppointment) => {
    _logger("mapping-->", JSON.stringify(anAppointment));

    return (
      <React.Fragment key={"appt-" + anAppointment.id}>
        <AppointmentCard
          appointment={anAppointment}
          cancelClicked={onClickedCancel}
          confirmClicked={onClickedConfirm}
        ></AppointmentCard>
      </React.Fragment>
    );
  };

  const onScheduleAppointmentClicked = (evt) => {
    _logger(evt);
    swal({
      title: "Are you sure you want to schedule a new appointment?",
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
    }).then((willSchedule) => {
      if (willSchedule) {
        getAppointmentTimes();
      } else {
        swal("Cancelled scheduling new appointment...");
      }
    });
  };

  const onGetAllSuccess = (data) => {
    const appointments = data.items.map(mapTimeZoneToAppt);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload = {
      timeZone: userTimeZone,
      appts: appointments,
      isEditing: false,
    };
    const stateToCarryOver = { type: "appointment", payload: payload };
    navigate("/appointments/form", { state: stateToCarryOver });
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

  return (
    <React.Fragment>
      {apptState.show && (
        <React.Fragment>
          <Pagination
            onChange={onPageChange}
            current={apptState.page.current}
            total={apptState.totalNumAppointments}
          />
          <div className="row">
            <form className="col-md-3">
              <div className="mb-3"></div>
            </form>
          </div>
          <div className="row extra-padding">
            <div className="mb-3 float-left col-4">
              <h1>Appointments</h1>
            </div>
            <div className="col-4" />
            <div className="col-4">
              <button
                className="btn btn-primary me-auto mt-2"
                type="button"
                id="scheduleAppointment"
                onClick={onScheduleAppointmentClicked}
              >
                Schedule New Appointment
              </button>
            </div>
          </div>
          <div className="container">
            <div className="row">{apptState.arrayOfAppointmentsComponents}</div>
          </div>
        </React.Fragment>
      )}{" "}
    </React.Fragment>
  );
}

export default Appointment;
