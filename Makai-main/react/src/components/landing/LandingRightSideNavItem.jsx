import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Nav } from "react-bootstrap";
import userService from "services/userService";
import sabioDebug from "sabio-debug";
import { IoIosCart } from "react-icons/io";

const _logger = sabioDebug.extend("nav");

const LandingRightSideNavItem = (props) => {
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

  const onLoginClicked = () => {
    navigate("/login");
  };

  const onRegisterClicked = () => {
    navigate("/register");
  };

  const onShoppingCartClicked = () => {
    navigate("/shoppingcart");
  };

  return (
    <React.Fragment>
      {isUserLoggedIn && (
        <Nav navbar className="ms-auto">
          <Nav.Item>
            <button
              className="nav-link py-1 btn btn-outline-secondary me-2"
              onClick={onShoppingCartClicked}
            >
              <IoIosCart />
            </button>
          </Nav.Item>
          <Nav.Item>
            <button
              className="nav-link py-1 btn shadow-none"
              onClick={onLogOutClicked}
            >
              Logout
            </button>
          </Nav.Item>
        </Nav>
      )}
      {!isUserLoggedIn && (
        <Nav navbar className="ms-auto">
          <Nav.Item>
            <button
              className="nav-link py-1 btn shadow-none"
              onClick={onLoginClicked}
            >
              Login
            </button>
          </Nav.Item>
          <Nav.Item>
            <button
              className="nav-link py-1 btn shadow-none"
              onClick={onRegisterClicked}
            >
              Register
            </button>
          </Nav.Item>
        </Nav>
      )}
    </React.Fragment>
  );
};

LandingRightSideNavItem.propTypes = {
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }).isRequired,
};
export default LandingRightSideNavItem;
