import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";

const TwoFactorSetting = ({ isTwoFA, switch2FA }) => {
  const _logger = debug.extend("twoFactorSettings");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isTwoFA);
  }, [isTwoFA]);

  const edit2FA = (e) => {
    let value = false;
    _logger("Event: ", e.target.id, "value: ", value);
    if (e.target.id === "enableButton") {
      value = true;
    }
    _logger("Current: ", checked, "New: ", value);
    switch2FA(value);
  };

  return (
    <div>
      <div className="profile-card-subheader">
        Two-Factor Authentication Settings
      </div>
      <div className="profile-card-subtitle pt-2 pb-1">
        Enable SMS two factor authentication associated with your user account
        {"'"}s mobile phone number.
      </div>
      <Col sm={6} lg={3}>
        <Form.Group>
          <Form.Check
            inline
            type="radio"
            id="enableButton"
            label="Enabled"
            name="themeToggleRadio"
            checked={checked ? true : false}
            onChange={edit2FA}
          />
          <Form.Check
            inline
            type="radio"
            id="disableButton"
            label="Disabled"
            name="themeToggleRadio"
            checked={checked ? false : true}
            onChange={edit2FA}
          />
        </Form.Group>
      </Col>
    </div>
  );
};

TwoFactorSetting.propTypes = {
  isTwoFA: PropTypes.bool.isRequired,
  switch2FA: PropTypes.func.isRequired,
};

export default TwoFactorSetting;
