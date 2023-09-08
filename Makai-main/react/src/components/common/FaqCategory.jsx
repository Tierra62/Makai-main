import React from "react";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

function FaqCategory(props) {
  const AFaqCategory = props.faqCategory;

  const onLocalClicked = () => {
    props.onCategoryChange(AFaqCategory.id);
  };
  return (
    <React.Fragment>
      <Button onClick={onLocalClicked} variant="outline-primary mx-2">
        {AFaqCategory?.name}
      </Button>
    </React.Fragment>
  );
}

FaqCategory.propTypes = {
  faqCategory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onCategoryChange: PropTypes.func.isRequired,
};

export default FaqCategory;
