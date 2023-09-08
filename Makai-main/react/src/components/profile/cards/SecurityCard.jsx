import React from "react";
import FalconCardHeader from "components/common/FalconCardHeader";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import "../profile.css";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import TwoFactorSetting from "components/twofactor/TwoFactorSettings";

const SecurityCard = ({ user, handleEmailChange, handle2FAChange }) => {
  const onEmailChange = (newEmail) => {
    handleEmailChange(newEmail);
  };

  return (
    <Card>
      <FalconCardHeader title="Security"></FalconCardHeader>
      <Card.Body className="pt-3 bg-light">
        <div className="d-flex flex-wrap">
          <ChangePasswordForm currentUser={user} />
          <ChangeEmailForm
            currentUser={user}
            handleEmailChange={onEmailChange}
          />
        </div>
        <div className="border-dashed border-bottom my-3" />
        <TwoFactorSetting isTwoFA={user.is2FA} switch2FA={handle2FAChange} />
      </Card.Body>
    </Card>
  );
};

SecurityCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    phone: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
    is2FA: PropTypes.bool.isRequired,
  }).isRequired,
  handleEmailChange: PropTypes.func.isRequired,
  handle2FAChange: PropTypes.func.isRequired,
};

export default SecurityCard;
