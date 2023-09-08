import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisH } from "react-icons/fa";
import classNames from "classnames";
import AppContext from "context/context";

const CardDropdown = ({ btnRevealClass, drop, children }) => {
  const {
    config: { isRTL },
  } = useContext(AppContext);

  return (
    <Dropdown
      className="font-sans-serif btn-reveal-trigger"
      align={isRTL ? "start" : "end"}
      drop={drop}
    >
      <Dropdown.Toggle
        variant="link"
        size="sm"
        data-boundary="viewport"
        className={classNames("text-600", {
          [btnRevealClass]: btnRevealClass,
          "btn-reveal": !btnRevealClass,
        })}
      >
        <FaEllipsisH className="fs--2" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="border py-0">
        {children}
        {!children && (
          <div className="py-2">
            <Dropdown.Item>View</Dropdown.Item>
            <Dropdown.Item>Export</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger">Remove</Dropdown.Item>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

CardDropdown.propTypes = {
  btnRevealClass: PropTypes.string,
  drop: PropTypes.string,
  children: PropTypes.node,
};

export default CardDropdown;