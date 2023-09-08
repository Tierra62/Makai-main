import React from "react";
import { ErrorMessage, useFormikContext, Field } from "formik";
import DatePicker from "react-datepicker";
import sabio from "sabio-debug";
const _logger = sabio.extend("right");
const NewsletterRightField = ({ content, index }) => {
  const { setFieldValue } = useFormikContext();
  let result = null;
  let switchValue = 0;
  if (content?.keyType) {
    switchValue = content.keyType.id;
  } else {
    switchValue = content.dataTypeId;
  }
  _logger("Here's content", content);
  switch (switchValue) {
    case 1:
    case 2:
    case 3:
    case 5:
    case 6:
    case 7:
      result = (
        <div className="row mb-3">
          <label
            className="col-sm-2 col-form-label"
            htmlFor={`contentList[${index}].value`}
          >
            {content.name}
          </label>
          <div className="col-sm-10">
            <Field
              className="form-control"
              id={`contentList[${index}].value`}
              type="text"
              name={`contentList[${index}].value`}
              value={content?.value || ""}
            />
            <ErrorMessage name={`contentList[${index}].value`} />
          </div>
        </div>
      );
      break;

    case 4:
      result = (
        <div className="row mb-3">
          <label
            className="col-sm-2 col-form-label"
            htmlFor={`contentList[${index}].value`}
          >
            {content.name}
          </label>
          <div className="col-sm-10">
            <Field
              className="form-check"
              id={`contentList[${index}].value`}
              type="checkbox"
              name={`contentList[${index}].value`}
              value={content?.value || ""}
            />
            <ErrorMessage name={`contentList[${index}].value`} />
          </div>
        </div>
      );
      break;

    case 8:
      if (content.value) {
        content.value = new Date(content.value);
      }
      result = (
        <div className="row mb-3">
          <label
            className="col-sm-2 col-form-label"
            htmlFor={`contentList[${index}].value`}
          >
            {content.name}
          </label>
          <div className="col-sm-10">
            <DatePicker
              name={`contentList[${index}].value`}
              id={`contentList[${index}].value`}
              wrapper
              className="form-control"
              showIcon
              selected={content.value}
              onChange={(dateValue) => {
                setFieldValue(
                  `contentList[${index}].value`,
                  new Date(dateValue)
                );
              }}
            />
            <ErrorMessage name={`contentList[${index}].value`} />
          </div>
        </div>
      );
      break;

    default:
      result = <h1>Not handled key type</h1>;
      break;
  }
  return result;
};

export default NewsletterRightField;
