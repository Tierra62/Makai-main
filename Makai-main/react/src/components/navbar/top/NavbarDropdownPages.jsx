import React from "react";
import PropTypes from "prop-types";
import { Nav, Row, Col } from "react-bootstrap";
import NavbarNavLink from "./NavbarNavLink";

const NavbarDropdownPages = () => {
  const reserves = {
    name: "Reservations",
    to: "/reservations",
    active: true,
  };

  const product = {
    name: "Shop",
    to: "/products",
    active: true,
  };

  return (
    <>
      <Row>
        <Col>
          <Nav className="flex-column">
            <NavbarNavLink key="Shop" route={product} />
            <NavbarNavLink key="Reservations" route={reserves} />
          </Nav>
        </Col>
      </Row>
    </>
  );
};

NavbarDropdownPages.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      name: PropTypes.string.isRequired,
      to: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.shape),
    }).isRequired
  ).isRequired,
};

export default NavbarDropdownPages;
