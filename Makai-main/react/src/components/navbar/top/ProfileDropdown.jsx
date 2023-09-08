import { FaCrown } from "react-icons/fa";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import team3 from "assets/img/team/3.jpg";
import Avatar from "components/common/Avatar";
import PropTypes from "prop-types";
import userService from "services/userService";
import sabioDebug from "sabio-debug";

const _logger = sabioDebug.extend("dropdown");

const ProfileDropdown = (props) => {
  const isUserLoggedIn = props.currentUser.isLoggedIn;
  const navigate = useNavigate();

  const onLogOutClicked = () => {
    userService.logoutUser().then(onLogOutSuccess).catch(onLogOutError);
  };

  const onLogOutSuccess = (response) => {
    _logger(response);

    const stateForTransport = { type: "USER_LOGOUT" };
    navigate("/login", { state: stateForTransport });
  };

  const onLogOutError = (error) => {
    _logger(error);
  };

  return (
    <Dropdown navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className="pe-0 ps-2 nav-link"
      >
        <Avatar src={team3} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-caret dropdown-menu-card  dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item className="fw-bold text-warning" href="#!">
            <FaCrown className="me-1" />
            <span>Go Pro</span>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#!">Set status</Dropdown.Item>
          <Dropdown.Item as={Link} to="/user/profile">
            Profile &amp; account
          </Dropdown.Item>
          <Dropdown.Item href="#!">Feedback</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to="/user/settings">
            Settings
          </Dropdown.Item>
          {isUserLoggedIn && (
            <Dropdown.Item as={Link} to="/login" onClick={onLogOutClicked}>
              Logout
            </Dropdown.Item>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

ProfileDropdown.propTypes = {
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }).isRequired,
};

export default ProfileDropdown;
