import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Field } from "formik";
import PropTypes from "prop-types";

function AutocompleteTemplate(props) {
  return (
    <Autocomplete
      className="lineOne p-0 m-0"
      options={props.options}
      onPlaceChanged={props.onPlaceChanged}
      onLoad={props.onLoad}
    >
      <Field type="text" name="lineOne" className="form-control"></Field>
    </Autocomplete>
  );
}

AutocompleteTemplate.propTypes = {
  options: PropTypes.func,
  onPlaceChanged: PropTypes.func,
  onLoad: PropTypes.func,
};

export default AutocompleteTemplate;

// Documentation: https://react-google-maps-api-docs.netlify.app/#!/Autocomplete/1
