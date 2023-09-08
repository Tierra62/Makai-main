import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";

const _logger = debug.extend(
  "EmergencyContactSysAdminViewEmergencyContactEntry"
);

function EmergencyContactSysAdminViewEmergencyContactEntry(props) {
  _logger("compiling EC card...");
  return (
    <tr>
      <td scope="col">{props.emergencyContact.name}</td>
      <td scope="col">{props.emergencyContact.phoneNumber}</td>
    </tr>
  );
}

EmergencyContactSysAdminViewEmergencyContactEntry.propTypes = {
  emergencyContact: PropTypes.shape({
    userInfo: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
};

export default EmergencyContactSysAdminViewEmergencyContactEntry;
