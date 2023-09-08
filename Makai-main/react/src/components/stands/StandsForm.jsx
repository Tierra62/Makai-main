import React, { useEffect, useState } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import debug from "sabio-debug";
import { standInsertSchema } from "schemas/standInsertSchema";
import lookUpService from "services/lookUpService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import standsService from "services/standsService";
import { formatDateInput } from "utils/dateFormater";
import locationsService from "services/locationsService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import StandsMap from "./StandsMap";

const _logger = debug.extend("standsForm");
function StandsForm() {
  const [mapLocations, setMapLocations] = useState();

  const [data] = useState({
    standStatusId: "",
    standTypeId: "",
    partnerId: 1, //// this will be changed once we are in dashboard of partner
    locationId: 0,
    isReservable: false,
    dateOpened: "",
  });

  const [formData, setFormData] = useState({
    statusIdMapped: [],
    standTypesMaped: [],
    locationsMapped: [],
    newLocation: false,
    isFormSubmitted: false,
  });

  useEffect(() => {
    lookUpService
      .LookUp(["StandStatusType", "StandTypes"])
      .then(onGetLookupSuccess)
      .catch(onGetLookUpError);

    locationsService
      .getByLocationType(5)
      .then(onGetByLocationSuccess)
      .catch(onGetByLocationError);
  }, []);

  const mapFromLocations = (aStatus) => {
    return (
      <option key={aStatus.id} value={aStatus.id}>
        {aStatus.lineOne}, {aStatus.city}, {aStatus.state.col3}
      </option>
    );
  };

  const mapFromLookUp = (aStatus) => {
    return (
      <option key={aStatus.id} value={aStatus.id}>
        {aStatus.name}
      </option>
    );
  };

  const onGetByLocationSuccess = (data) => {
    _logger("Locations success", data);
    let locations = data.items;
    setMapLocations(() => {
      let newLocs = data.items.map((loc) => {
        return { id: loc.id, lat: loc.latitude, lng: loc.longitude };
      });
      return newLocs;
    });
    setFormData((prevState) => {
      let newState = { ...prevState };
      newState.locationsMapped = locations.map(mapFromLocations);
      return newState;
    });
  };

  const onGetByLocationError = (error) => {
    _logger("Locations error", error);
  };

  const onGetLookupSuccess = (data) => {
    _logger(data);
    let statusTypes = data.item.standStatusType;
    let standTypes = data.item.standTypes;

    setFormData((prevState) => {
      let newState = { ...prevState };
      newState.statusIdMapped = statusTypes.map(mapFromLookUp);
      newState.standTypesMaped = standTypes.map(mapFromLookUp);
      return newState;
    });
  };

  const onGetLookUpError = (error) => {
    _logger("Error on lookup service", error);
  };

  const handleSubmit = (values, { resetForm }) => {
    _logger("Values of the payload", values);

    if (values.dateOpened === false) {
      values.dateOpened = null;
    } else {
      values.dateOpened = formatDateInput(values.dateOpened);
    }

    _logger(values.dateOpened);

    standsService
      .add(values)
      .then((response) => onAddSuccess(response, resetForm))
      .catch(onAddError);
  };

  const onAddSuccess = (response, resetForm) => {
    _logger(response, "Add stand success");
    Toastify({
      text: "A stand has been created",
      className: "Success",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
    setFormData((prevState) => ({
      ...prevState,
      isFormSubmitted: !prevState.isFormSubmitted,
    }));
    resetForm();
  };

  const onAddError = (error) => {
    _logger(error, "Add stand error");
    Toastify({
      text: "Error with creating a stand",
      className: "Error",
      style: {
        background: "linear-gradient(to right, #ff3703, #ff5903)",
      },
    }).showToast();
  };

  _logger(data);

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={data}
        onSubmit={handleSubmit}
        validationSchema={standInsertSchema}
      >
        {({ setFieldValue, values }) => (
          <div className="container-fluid p-0 mt-4">
            <div className="row">
              <div className="mb-2 col-xl-6 col-lg-12 col-md-12">
                <div className="card p-3">
                  <Form>
                    <div className="form-group">
                      <div>
                        <label htmlFor="standStatusId">
                          Select a stand status
                        </label>
                      </div>
                      <Field
                        as="select"
                        name="standStatusId"
                        aria-describedby="enterModel"
                        className="form-group form-select"
                      >
                        <option value="0" label="Status" className="text-muted">
                          Select a status
                        </option>
                        {formData.statusIdMapped}
                      </Field>
                      <ErrorMessage
                        name="standStatusId"
                        component="span"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group">
                      <div>
                        <label htmlFor="standTypeId">Select a stand type</label>
                      </div>
                      <Field
                        as="select"
                        name="standTypeId"
                        aria-describedby="enterModel"
                        className="form-group form-select"
                      >
                        <option value="0" label="Type" className="text-muted">
                          Select a type
                        </option>
                        {formData.standTypesMaped}
                      </Field>
                      <ErrorMessage
                        name="standTypeId"
                        component="span"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group">
                      <div>
                        <label htmlFor="locationId">Select a location</label>
                      </div>
                      <Field
                        // onChange={locationChange}
                        as="select"
                        name="locationId"
                        aria-describedby="enterModel"
                        className="form-group form-select"
                      >
                        <option
                          value="0"
                          label="Location"
                          className="text-muted"
                        >
                          Select a location
                        </option>
                        {formData.locationsMapped}
                      </Field>
                      <ErrorMessage
                        name="locationId"
                        component="span"
                        className="text-danger"
                      />
                    </div>

                    <div className="">
                      <a href="/locations/new">add address</a>
                    </div>

                    <div className="form-group fw-bold ">
                      <label htmlFor="dateOpened">Date Opened</label>
                      <DatePicker
                        id="dateOpened"
                        showIcon
                        name="dateOpened"
                        className="form-control"
                        onChange={(date) => {
                          setFieldValue("dateOpened", date);
                        }}
                        selected={values.dateOpened}
                      />

                      <ErrorMessage
                        name="dateOpened"
                        component="span"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group mt-1">
                      <Field
                        id="checkBoxLabel"
                        type="checkbox"
                        className="form-check-input"
                        name="isReservable"
                      />
                      <label className="mx-1" htmlFor="checkBoxLabel">
                        Is the stand reservable?
                      </label>
                      <ErrorMessage
                        name="isPublished"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="mt-3">
                      <button type="submit" className="btn btn-primary  btn-sm">
                        Submit
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
              <div className=" card col-xl-6 col-lg-12 col-md-12 mb-2 justify-content-center max-w-25">
                <StandsMap
                  locationId={values.locationId}
                  locations={mapLocations}
                  isFormSubmitted={formData.isFormSubmitted}
                />
                <div style={{ minHeight: "90%" }} id="mapContainer"></div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default StandsForm;
