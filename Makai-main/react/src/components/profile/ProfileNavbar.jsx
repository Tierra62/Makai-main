import React from "react";
import { Card } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import PropTypes from "prop-types";
import { Navbar } from "react-bootstrap";
import {
  FiCreditCard,
  FiSidebar,
  FiUser,
  FiLock,
  FiBell,
  FiPower,
  FiStar,
  FiThumbsUp,
  FiBookOpen,
} from "react-icons/fi";
import "./profile.css";

const ProfileNavbar = ({ handleSelection, activeSelection }) => {
  const onNavItemClicked = (eventKey) => {
    handleSelection(eventKey);
  };

  const renderNavClassName = (currentItem) => {
    return activeSelection === currentItem
      ? "active-selection"
      : "shadow-hover";
  };

  return (
    <Card className="mb-3 rounded bg-light">
      <Navbar
        className="mx-0 px-0 profile-navbar"
        variant={"light"}
        sticky="left"
        onSelect={onNavItemClicked}
      >
        <div className="text-center">
          <strong className="card-text profile-nav-header">RENTALS</strong>
        </div>
        <Nav.Item
          className={`py-1 profile-nav-item ${renderNavClassName("orders")}`}
        >
          <Nav.Link eventKey="orders">{<FiSidebar />} Orders</Nav.Link>
        </Nav.Item>
        <Nav.Item
          className={`py-1 profile-nav-item ${renderNavClassName("payments")}`}
        >
          <Nav.Link eventKey="payments">{<FiCreditCard />} Payments</Nav.Link>
        </Nav.Item>
        <Nav.Item className="py-1 profile-nav-item">
          <Nav.Link eventKey="lessons" disabled>
            {<FiBookOpen />} Lessons
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="py-1 profile-nav-item">
          <Nav.Link eventKey="ratings" disabled>
            {<FiStar />} Ratings
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="py-1 profile-nav-item">
          <Nav.Link eventKey="reviews" disabled>
            {<FiThumbsUp />} Reviews
          </Nav.Link>
        </Nav.Item>
        <div className="text-center">
          <strong className="card-text profile-nav-header">SETTINGS</strong>
        </div>

        <Nav.Item
          className={`py-1 profile-nav-item ${renderNavClassName("edit")}`}
        >
          <Nav.Link eventKey="edit">{<FiUser />} Edit Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item
          className={`py-1 profile-nav-item ${renderNavClassName("security")}`}
        >
          <Nav.Link eventKey="security">{<FiLock />} Security</Nav.Link>
        </Nav.Item>
        <Nav.Item
          className={`py-1 profile-nav-item ${renderNavClassName(
            "notifications"
          )}`}
        >
          <Nav.Link eventKey="notifications">
            {<FiBell />} Notifications
          </Nav.Link>
        </Nav.Item>
        <Nav.Item
          className={`py-1 profile-nav-item ${renderNavClassName("logout")}`}
        >
          <Nav.Link eventKey="logout">{<FiPower />} Logout</Nav.Link>
        </Nav.Item>
      </Navbar>
    </Card>
  );
};

ProfileNavbar.propTypes = {
  handleSelection: PropTypes.func,
  activeSelection: PropTypes.string,
};

export default ProfileNavbar;
