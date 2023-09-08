import React from "react";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function EmergencyContactCard(props) {
  const aContact = props.contact;
  const navigate = useNavigate();

  const onDeleteClicked = (event) => {
    event.preventDefault();
    props.onDeleteClicked(props.contact, event);
  };

  const onUpdateClicked = () => {
    const stateForTransport = {
      type: "EMERGENCY_CONTACTS_UPDATE",
      name: aContact.name,
      phoneNumber: aContact.phoneNumber,
      id: aContact.id,
    };

    navigate(`/emergency/contact/${aContact.id}/edit`, {
      state: stateForTransport,
      type: "EMERGENCY_CONTACTS_UPDATE",
    });
  };

  return (
    <div className="col-sm-12 mt-3">
      <Card id={aContact.id}>
        <Card.Body>
          <Card.Title>
            {aContact.name}
            <FiTrash2
              type="button"
              className="h3 text-danger float-end"
              onClick={onDeleteClicked}
            >
              Delete
            </FiTrash2>
          </Card.Title>
          <Card.Text>Contact Number: {aContact.phoneNumber}</Card.Text>
          <FiEdit
            type="button"
            className="h3 float-end"
            onClick={onUpdateClicked}
          >
            Edit Contact
          </FiEdit>
        </Card.Body>
      </Card>
    </div>
  );
}

EmergencyContactCard.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

export default React.memo(EmergencyContactCard);
