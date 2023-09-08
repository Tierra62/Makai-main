import React from "react";
import PropTypes from "prop-types";
import { Nav, Row, Col } from "react-bootstrap";
import { getFlatRoutes } from "helpers/utils";
import NavbarNavLink from "./NavbarNavLink";

const NavbarDropdownApp = ({ items }) => {
  const routes = getFlatRoutes(items);

  return (
    <Row>
      <Col>
        <Nav className="flex-column">
          {routes.social.map((route) => (
            <NavbarNavLink key={route.name} route={route} />
          ))}
        </Nav>
      </Col>
    </Row>
  );
};

NavbarDropdownApp.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      name: PropTypes.string.isRequired,
      to: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired
  ).isRequired,
};

export default NavbarDropdownApp;
