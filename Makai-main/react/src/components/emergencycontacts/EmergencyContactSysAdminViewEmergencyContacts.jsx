import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import { useNavigate, useLocation } from "react-router-dom";
import { Table } from "react-bootstrap";
import EmergencyContactSysAdminViewEmergencyContactEntry from "./EmergencyContactSysAdminViewEmergencyContactEntry";
import emergencyContactService from "../../services/emergencyContactService.js";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "toastr/build/toastr.css";
import toastr from "toastr";

const _logger = debug.extend("EmergencyContactSysAdminViewEmergencyContacts");

function EmergencyContactSysAdminViewEmergencyContacts() {
  const navigate = useNavigate();
  const location = useLocation();

  const [emergencyContactsState, setEmergencyContactsState] = useState({
    arrayOfEmergencyContacts: [],
    arrayOfEmergencyContactsComponents: [],
    totalNumEmergencyContacts: 0,
    userId: location.state.payload.id,
    page: {
      current: 1,
      currentIndex: 0,
    },
    show: false,
  });

  useEffect(() => {
    getAllEmergencyContacts();
  }, [emergencyContactsState.page.currentIndex]);

  const onPageChange = (newPage) => {
    _logger(`current page: ${JSON.stringify(emergencyContactsState.page)}`);
    _logger(`changing page.current to: ${newPage}`);

    setEmergencyContactsState((prevState) => {
      const newState = { ...prevState };
      newState.page.current = newPage;
      newState.page.currentIndex = newPage - 1;
      return newState;
    });
  };

  const getAllEmergencyContacts = () => {
    _logger(`current page: ${JSON.stringify(emergencyContactsState.page)}`);

    emergencyContactService
      .getByUserIdPaginated(
        emergencyContactsState.page.currentIndex,
        5,
        emergencyContactsState.userId
      )
      .then(onGetByUserIdPaginatedSuccess)
      .catch(onGetByUserIdPaginatedError);
  };

  const onGetByUserIdPaginatedSuccess = (data) => {
    _logger(`data: ${JSON.stringify(data)}`);
    _logger(`total number of emergency contacts: ${data.item.totalCount}`);

    setEmergencyContactsState((prevState) => {
      const newState = { ...prevState };
      newState.totalNumEmergencyContacts = data.item.totalCount * 2;
      newState.arrayOfEmergencyContacts = data.item.pagedItems;
      newState.arrayOfEmergencyContactsComponents =
        newState.arrayOfEmergencyContacts.map(mapEmergencyContactEntry);
      if (!newState.show) {
        newState.show = true;
      }
      return newState;
    });
  };

  const onGetByUserIdPaginatedError = (err) => {
    _logger(JSON.stringify(err));
    toastr.error(
      "Retrieval of User's Emergency Contacts Unsuccessful! Try reloading the page or logging in again...",
      `${err}`
    );
  };

  const mapEmergencyContactEntry = (anEmergencyContact) => {
    _logger("mapping-->", JSON.stringify(anEmergencyContact));

    return (
      <React.Fragment key={"emergencycontact-" + anEmergencyContact.id}>
        <EmergencyContactSysAdminViewEmergencyContactEntry
          emergencyContact={anEmergencyContact}
        ></EmergencyContactSysAdminViewEmergencyContactEntry>
      </React.Fragment>
    );
  };

  const onNavigateBackClicked = (evt) => {
    _logger(evt);
    navigate("/emergency/contact/admin/users/view");
  };

  return (
    <React.Fragment>
      {emergencyContactsState.show && (
        <React.Fragment>
          <div className="col-3">
            <button className="btn btn-primary" onClick={onNavigateBackClicked}>
              {"<-- Go Back To Users"}
            </button>
          </div>
          <h1>
            <strong>Emergency Contacts</strong>
          </h1>
          <Table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {emergencyContactsState.arrayOfEmergencyContactsComponents}
            </tbody>
          </Table>
          <Pagination
            onChange={onPageChange}
            current={emergencyContactsState.page.current}
            total={emergencyContactsState.totalNumEmergencyContacts}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default EmergencyContactSysAdminViewEmergencyContacts;
