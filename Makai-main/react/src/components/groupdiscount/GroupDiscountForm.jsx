import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { groupDiscountSchema } from "schemas/groupDiscountSchema";
import lookUpService from "services/lookUpService";
import * as GroupDiscountService from "services/groupDiscountService";
import toastr from "toastr";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateInput } from "../../utils/dateFormater";
import "./groupdiscount.css";

function GroupDiscountForm() {
  const [discountFormData, setDiscountFormData] = useState({
    name: "",
    description: "",
    discountTypeId: "",
    value: "",
    startDate: "",
    endDate: "",
  });

  const [lookUpLists, setLookUps] = useState({
    discountTypesOptions: [],
  });
  const onHandleSubmitError = () => {
    toastr.error("Group Discount was not created");
  };
  const navigate = useNavigate();
  const onHandleSubmitSuccess = () => {
    toastr.success("Group Discount created!");
    navigate(`/groupdiscounts`);
  };

  const location = useLocation();
  useEffect(() => {
    if (location?.state?.type === "discountEdit" && location.state.payload) {
      setDiscountFormData((prevState) => {
        const discount = { ...prevState, ...location.state.payload };
        discount.discountTypeId = location.state.payload.discountType.id;
        discount.startDate = formatDateInput(discount.startDate);
        discount.endDate = formatDateInput(discount.endDate);
        return discount;
      });
    }
  }, []);

  const handleSubmit = (values) => {
    if (discountFormData.id) {
      GroupDiscountService.updateGroupDiscount(values.id, values)
        .then(onHandleUpdateSuccess)
        .catch(onHandleUpdateError);
    } else {
      GroupDiscountService.createGroupDiscount(values)
        .then(onHandleSubmitSuccess)
        .catch(onHandleSubmitError);
    }
  };

  const onHandleUpdateSuccess = () => {
    toastr.success("Group Discount was edited");
    navigate(`/groupdiscounts`);
  };

  const onHandleUpdateError = () => {
    toastr.error("Group Discount was not edited!");
  };
  const mapSelectOption = (anItem) => {
    return (
      <option key={anItem.id} value={anItem.id}>
        {anItem.name}
      </option>
    );
  };
  const onGetLookUpSuccess = (response) => {
    setLookUps((prevState) => {
      const newState = { ...prevState };
      newState.discountTypesOptions =
        response.item.discountTypes.map(mapSelectOption);
      return newState;
    });
  };

  useEffect(() => {
    lookUpService.LookUp(["DiscountTypes"]).then(onGetLookUpSuccess);
  }, []);

  return (
    <div className="container mt-5 border white-border  bg-light rounded pb-3 pt-3">
      <div className="row">
        <h1 className="text-center">Group Discount Form</h1>
        <figcaption className="blockquote-footer text-center">
          Here you can create or edit a Discount For your Customers
        </figcaption>
        <div className="col">
          <Formik
            enableReinitialize={true}
            initialValues={discountFormData}
            onSubmit={handleSubmit}
            validationSchema={groupDiscountSchema}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="name"> Name</label>
                <Field type="text" name="name" className="form-control" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="form-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description"> Description</label>
                <Field
                  type="text"
                  name="description"
                  className="form-control"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="form-text"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discountTypeId"> Discount Type</label>
                <Field
                  as="select"
                  name="discountTypeId"
                  className="form-control"
                >
                  <option>Select Discount</option>
                  {lookUpLists.discountTypesOptions}
                </Field>
                <ErrorMessage
                  name="discountTypeId"
                  component="div"
                  className="form-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="value"> Value</label>
                <Field type="number" name="value" className="form-control" />
                <ErrorMessage
                  name="value"
                  component="div"
                  className="form-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start date
                </label>
                <Field type="date" className="form-control" name="startDate" />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="form-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End date
                </label>
                <Field type="date" className="form-control" name="endDate" />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="form-text"
                />
              </div>
              <hr />
              <button
                type="submit"
                className="btn text-white discount-color-button"
              >
                Submit Discount
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default GroupDiscountForm;
