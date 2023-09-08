import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Nav, Row, Col, Dropdown } from "react-bootstrap";
import { getFlatRoutes } from "helpers/utils";
import { Link } from "react-router-dom";
import AppContext from "context/context.js";
import logger from "sabio-debug";
const _logger = logger.extend("App");

const NavbarDropdownSettings = ({ items }) => {
  const routes = getFlatRoutes(items);
  _logger(routes, "NavbarDropdownSettings ---> routes");
  _logger(items, "NavbarDropdownSettings ---> items");
  const {
    config: { navbarCollapsed, showBurgerMenu },
    setConfig,
  } = useContext(AppContext);

  const handleDropdownItemClick = () => {
    if (navbarCollapsed) {
      setConfig("navbarCollapsed", !navbarCollapsed);
    }
    if (showBurgerMenu) {
      setConfig("showBurgerMenu", !showBurgerMenu);
    }
  };
  return (
    <>
      <Row>
        <Col>
          <Nav className="flex-column">
            {routes.user.map((route) => (
              <Dropdown.Item
                key={route.name}
                as={Link}
                className={route.active ? "link-600" : "text-500"}
                to={route.to}
                onClick={handleDropdownItemClick}
              >
                {route.name}
              </Dropdown.Item>
            ))}
          </Nav>
        </Col>
      </Row>
    </>
  );
};

NavbarDropdownSettings.propTypes = {
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

export default NavbarDropdownSettings;
