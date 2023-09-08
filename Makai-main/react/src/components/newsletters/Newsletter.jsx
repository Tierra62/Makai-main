import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

import { generateValidationSchema } from "../../schemas/newsletterSchema.js";
import * as newsletterService from "../../services/newsletterService.js";
import * as newsletterTemplateService from "../../services/newsletterTemplateService.js";
//import * as newsletterContentService from "../../services/newsletterContentService.js";

import DatePicker from "react-datepicker";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Toastify from "toastify-js";

import "react-datepicker/dist/react-datepicker.css";
import NewsletterRightField from "./NewsletterRightField.jsx";
import debug from "sabio-debug";

function Newsletter() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const _logger = debug.extend("NewsletterForm");

  const [templateData, setTemplateData] = useState();
  //const [initialContentList, setContentList] = useState();

  useEffect(() => {
    _logger("here's the state coming in", state);
    newsletterTemplateService
      .getAll(0, 10)
      .then(successGetNewsletterTemplates)
      .catch(failureGetNewsletterTemplates);

    /*if (state && state.type === "NEWSLETTER_VIEW") {
      newsletterContentService
        .selectByNewsletterId(state.payload.id)
        .then(successGetContent)
        .catch(failureGetContent);
    }*/
  }, []);

  const [formData] = useState({
    templateId: state?.payload?.templateId || "",
    name: state?.payload?.name || "",
    coverPhoto: state?.payload?.coverPhoto || null,
    dateToPublish:
      state?.payload?.dateToPublish &&
      state.payload.dateToPublish !== "0001-01-01T00:00:00"
        ? new Date(state?.payload.dateToPublish)
        : null,
    dateToExpire:
      state?.payload?.dateToExpire &&
      state.payload.dateToExpire !== "0001-01-01T00:00:00"
        ? new Date(state?.payload.dateToExpire)
        : null,
    contentList: state?.payload?.contentList || [],
  });

  /*const successGetContent = (response) => {
    _logger("here's the content", response);
    const newContentList = response.item.map((arrayItem) => {
      const newArrayItem = {};
      newArrayItem.value = arrayItem.value;
      newArrayItem.id = arrayItem.newsletterContentId;
      newArrayItem.templateKeyId = arrayItem.templateKeyId;
      newArrayItem.name = arrayItem.keyName;
      newArrayItem.dataTypeId = arrayItem.keyTypeId;
      return newArrayItem;
    });
  };
  const failureGetContent = (response) => {
    _logger("failed", response);
  };*/

  const successGetNewsletterTemplates = (response) => {
    _logger(response, "here's all the template data");
    setTemplateData(() => {
      return response.item.pagedItems.map((item) => ({
        ...item,
        templateDataList: item.templateDataList?.map((data) => ({
          ...data,
          value: null,
        })),
      }));
    });
  };

  const failureGetNewsletterTemplates = () => {
    Toastify({
      text: "Failed to get Template Data",
      className: "error",
      yar,
    }).showToast();
  };

  const handleSubmit = (values) => {
    const payload = values;
    const id = state?.payload?.id;
    if (id) {
      newsletterService
        .update(id, payload)
        .then(onEditNewsletterSuccess)
        .catch(onEditNewsletterError);
    } else {
      newsletterService
        .create(payload)
        .then(onSuccessNewsletterServices)
        .catch(onErrorNewsletterServices);
    }
  };

  const onEditNewsletterSuccess = () => {
    Toastify({
      text: "Update Success",
      className: "success",
    }).showToast();
    navigate("/newsletters/view");
  };
  const onEditNewsletterError = () => {
    Toastify({
      text: "Update Failure",
      className: "error",
    }).showToast();
  };
  const onSuccessNewsletterServices = () => {
    Toastify({
      text: "Successfully Added Newsletter",
      className: "success",
    }).showToast();
    navigate("/newsletters/view");
  };
  const onErrorNewsletterServices = () => {
    Toastify({
      text: "Unknown Error Adding Newsletter",
      className: "error",
    }).showToast();
  };

  const onTemplateChange = (e, setValues, setFieldValue, resetForm) => {
    let targetId = parseInt(e.target.value);
    resetForm();
    let targetIndex = templateData.findIndex((arrayObject) => {
      return arrayObject.id === targetId;
    });

    if (targetIndex > -1) {
      if (setValues && typeof setValues === "function") {
        setFieldValue(
          "contentList",
          templateData[targetIndex].templateDataList
        );
        setFieldValue("templateId", targetId);
      }
    }
  };

  return (
    <React.Fragment>
      <Card className="w-75">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="mb-0">Newsletter Submission Form</h5>
            <br />
            <br />
            <Formik
              enableReinitialize={true}
              initialValues={formData}
              onSubmit={handleSubmit}
              validationSchema={generateValidationSchema(formData.contentList)}
            >
              {({
                setFieldValue,
                setFieldTouched,
                setValues,
                values,
                resetForm,
              }) => (
                <Form>
                  <div className="row mb-3">
                    <label
                      className="col-sm-2 col-form-label"
                      htmlFor="templateId"
                    >
                      Select A Template
                    </label>
                    <div className="col-sm-4">
                      <Field
                        component="select"
                        className="form-control"
                        name="templateId"
                        onChange={(e) =>
                          onTemplateChange(
                            e,
                            setValues,
                            setFieldValue,
                            resetForm
                          )
                        }
                      >
                        <option value="">Select</option>
                        {templateData?.map((template) => {
                          return (
                            <option value={template.id} key={template.id}>
                              {" "}
                              {template.name}{" "}
                            </option>
                          );
                        })}
                      </Field>
                      <ErrorMessage name="templateId" />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-2 col-form-label" htmlFor="name">
                      Name
                    </label>
                    <div className="col-sm-10">
                      <Field
                        className="form-control"
                        id="name"
                        type="text"
                        name="name"
                      />
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      className="col-sm-2 col-form-label"
                      htmlFor="coverPhoto"
                    >
                      Cover Photo
                    </label>
                    <div className="col-sm-10">
                      <Field
                        className="form-control"
                        id="coverPhoto"
                        type="text"
                        name="coverPhoto"
                      />
                      <ErrorMessage name="coverPhoto" />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      className="col-sm-2 col-form-label"
                      htmlFor="basic-form-dob"
                    >
                      Date to Publish
                    </label>
                    <div className="col-sm-10">
                      <DatePicker
                        name="dateToPublish"
                        id="dateToPublish"
                        wrapper
                        className="form-control"
                        showIcon
                        minDate={new Date()}
                        selected={values.dateToPublish}
                        onChange={(dateToPublish) =>
                          setFieldValue("dateToPublish", dateToPublish)
                        }
                        onChangeRaw={() => {
                          setFieldTouched("dateToPublish", true, true);
                        }}
                      />
                      <ErrorMessage name="dateToPublish" />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      className="col-sm-2 col-form-label"
                      htmlFor="basic-form-dob"
                    >
                      Date to Expire
                    </label>
                    <div className="col-sm-10">
                      <DatePicker
                        name="dateToExpire"
                        id="dateToExpire"
                        wrapper
                        className="form-control"
                        showIcon
                        minDate={new Date()}
                        selected={values.dateToExpire}
                        onChange={(dateToExpire) =>
                          setFieldValue("dateToExpire", dateToExpire)
                        }
                        onChangeRaw={() => {
                          setFieldTouched("dateToExpire", true, true);
                        }}
                      />
                      <ErrorMessage name="dateToExpire" />
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                  <FieldArray
                    name="contentList"
                    render={() => (
                      <div>
                        {values.contentList &&
                          values.contentList.length > 0 &&
                          values.contentList.map((content, index) => (
                            <div key={index}>
                              <NewsletterRightField
                                content={content}
                                index={index}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  />
                  <button className="btn btn-info me-1 mb-1" type="submit">
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
}
export default Newsletter;
