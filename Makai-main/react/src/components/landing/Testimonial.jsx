import React from "react";
import PropTypes from "prop-types";
import Section from "components/common/Section";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialItem = ({
  description,
  author,
  designation,
  companyImage,
  size,
}) => {
  return (
    <div className="px-5 px-sm-6">
      <p className="fs-sm-1 fs-md-2 fst-italic text-dark">{description}</p>
      <p className="fs-0 text-600">
        - {author}, {designation}
      </p>
      <img className="w-auto mx-auto" src={companyImage} alt="" height={size} />
    </div>
  );
};

const Testimonial = () => <Section />;

TestimonialItem.propTypes = {
  description: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  designation: PropTypes.string.isRequired,
  companyImage: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default Testimonial;
