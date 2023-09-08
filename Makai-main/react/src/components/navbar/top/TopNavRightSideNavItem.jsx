import CartNotification from "components/navbar/top/CartNotification";
import NotificationDropdown from "components/navbar/top/NotificationDropdown";
import ProfileDropdown from "components/navbar/top/ProfileDropdown";
import React from "react";
import { Nav } from "react-bootstrap";
import NineDotMenu from "./NineDotMenu";
import PropTypes from "prop-types";

const TopNavRightSideNavItem = (props) => {
  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
    >
      <CartNotification />
      <NotificationDropdown />
      <NineDotMenu />
      <ProfileDropdown currentUser={props.currentUser} />
    </Nav>
  );
};

TopNavRightSideNavItem.propTypes = {
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }).isRequired,
};

export default TopNavRightSideNavItem;
