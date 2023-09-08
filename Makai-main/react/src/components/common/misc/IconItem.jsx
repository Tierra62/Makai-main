import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const IconItem = ({
  tag: Tag = "a",
  bg,
  size,
  color,
  className,
  onClick,
  ...rest
}) => (
  <Tag
    className={classNames(className, "icon-item", {
      [`icon-item-${size}`]: size,
      [`bg-${bg}`]: bg,
      [`text-${color}`]: color,
    })}
    {...rest}
    onClick={onClick}
  ></Tag>
);

IconItem.propTypes = {
  tag: PropTypes.string,
  href: PropTypes.string,
  bg: PropTypes.string,
  size: PropTypes.oneOf(["sm", "lg"]),
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default IconItem;
