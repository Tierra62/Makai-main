import React from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";

const ReviewPagination = ({ onChange, current, total }) => {
  return (
    <Pagination
      onChange={onChange}
      current={current}
      total={total}
      pageSize={5}
    />
  );
};

ReviewPagination.propTypes = {
  onChange: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ReviewPagination;
