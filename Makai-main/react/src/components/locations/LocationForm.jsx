import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import locationsService from "../../services/locationsService";
import lookUpService from "services/lookUpService";
import { locationSchema } from "schemas/locationSchema";
import AutocompleteTemplate from "./AutocompleteTemplate";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import swal from "sweetalert";

const _logger = debug.extend("LocationForm");
const GOOGLE_AUTOCOMPLTE_APIKEY = process.env.REACT_APP_GOOGLE_AUTO_COMPLETE;

function LocationForm() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_AUTOCOMPLTE_APIKEY, // ,
    libraries: ["places"],
    // ...otherOptions
  });

  const [addressFormData, setAddressFormData] = useState({
    locationTypeId: "",
    lineOne: "",
    lineTwo: "",
    city: "",
    zip: "",
    stateId: "",
    latitude: "",
    longitude: "",
  });

  const [lookUpData, setLookUpData] = useState({
    arrayOfLocations: [],
    locationComponent: [],
    arrayOfStates: [],
    stateComponent: [],
  });

  const [autoComplete, setAutoComplete] = useState();

  const [latLngMarker, setLatLngMarker] = useState({
    lat: 33.5985056,
    lng: -117.9011277,
    zoom: 10,
  });

  const containerStyle = {
    width: "600px",
    height: "600px",
  };

  const navigate = useNavigate();

  const onLoad = (autocomplete) => {
    _logger(autocomplete);
    setAutoComplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autoComplete) {
      const place = autoComplete.getPlace();
      const address = place.address_components;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const aPlace = autoComplete.getPlace();
      const addressComponents = aPlace["address_components"] || [];

      const streetNumber = extractFromAddress(
        addressComponents,
        "street_number"
      );
      const streetAddress = extractFromAddress(addressComponents, "route");

      const postalCode = extractFromAddress(addressComponents, "postal_code");

      const neighborhood = extractFromAddress(
        addressComponents,
        "neighborhood" || "political"
      );

      const city = extractFromAddress(
        addressComponents,
        "locality" || "political"
      );

      const stateName = extractFromAddress(
        addressComponents,
        "administrative_area_level_1" || "political"
      );

      _logger("Autocomplete: ", place, {
        lat,
        lng,
        address,
      });

      const state = lookUpData.arrayOfStates.find(
        (element) => element.name === stateName
      );

      setAddressFormData({
        ...addressFormData,
        lineOne: `${streetNumber}  ${streetAddress}`,
        lineTwo: neighborhood,
        city: city,
        stateId: state.id,
        zip: postalCode,
        latitude: lat,
        longitude: lng,
      });

      setLatLngMarker({
        ...latLngMarker,
        lat: lat,
        lng: lng,
        zoom: 15,
      });
    }
  };

  function extractFromAddress(components, type) {
    return (
      components
        .filter((component) => component.types.indexOf(type) === 0)
        .map((item) => item.long_name)
        .pop() || null
    );
  }

  const autoCompleteConfig = {
    componentRestrictions: { country: "us" },
    fields: ["address_components", "geometry"],
  };

  useEffect(() => {
    lookUpService
      .LookUp(["locationTypes"])
      .then(onLookUpSuccess)
      .catch(onLookUpError);

    lookUpService
      .LookUp3Col(["states"])
      .then(onLookUp3Success)
      .catch(onLookUp3Error);
  }, []);

  const onLookUpSuccess = (response) => {
    let lookUpLocations = response.item.locationTypes;
    setLookUpData((prevState) => {
      const myLocationsData = { ...prevState };
      myLocationsData.arrayOfLocations = lookUpLocations;
      myLocationsData.locationComponent = lookUpLocations.map(mapLocations);
      return myLocationsData;
    });
  };

  const onLookUpError = (response) => {
    _logger(response);
  };

  const onLookUp3Success = (response) => {
    let lookUpStates = response.items;
    setLookUpData((prevState) => {
      const myStatesData = { ...prevState };
      myStatesData.arrayOfStates = lookUpStates;
      myStatesData.stateComponent = lookUpStates?.map(mapStates);
      return myStatesData;
    });
  };

  const onLookUp3Error = (response) => {
    Toastify({
      text: "Could not load States information. Please refresh and try again",
      className: "Error",
    }).showToast();
    _logger(response);
  };

  const mapLocations = (location) => (
    <option value={location.id} key={`locations_${location.id}`}>
      {location.name}
    </option>
  );

  const mapStates = (state) => (
    <option value={state.id} key={`states_${state.id}`}>
      {state.name}
    </option>
  );

  const handleSubmit = (values) => {
    _logger("values: ", values);
    if (values.id) {
      locationsService
        .update(values.id, values)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    } else {
      locationsService.add(values).then(onAddSuccess).catch(onAddError);
    }
  };

  const onAddSuccess = (response) => {
    // Toastify({
    //   text: "Address added sucessfuly",
    //   className: "Success",
    // }).showToast();
    swal({
      title: "New location added!",
      text: "To go back to stands form click the Stand Form button. If you want to enter more locations click the stay button.",
      icon: "success",
      buttons: {
        stay: {
          text: "Stay",
          value: false,
          visible: true,
          className: "",
          closeModal: true,
        },
        goToPage: {
          text: "Stand Form",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
    }).then((value) => {
      if (value) {
        // User clicked "Go to another page"
        navigate("/stands/new", { state: response });
      } else {
        // User clicked "Stay on this page"
        // Do nothing or add your logic here
      }
    });
    _logger("onAddSuccessResponse:", response);
    navigate("/locations/update", { state: response });
    setAddressFormData((prevState) => {
      const updateAddressState = { ...prevState };
      updateAddressState.locationTypeId = response.locationTypeId;
      updateAddressState.id = response.id;
      return updateAddressState;
    });
  };

  const onAddError = (response) => {
    Toastify({
      text: "You have errors. Please Check your data and try again",
      className: "Success",
    }).showToast();
    _logger("onAddErrorResponse:", response);
  };

  const onUpdateSuccess = (response) => {
    _logger("onUpdateSuccessResponse:", response);
    Toastify({
      text: "Address updated sucessfuly",
      className: "Success",
    }).showToast();
  };

  const onUpdateError = (response) => {
    _logger(response);
    Toastify({
      text: "You have errors. Please Check your data and try again",
      className: "Error",
    }).showToast();
  };

  const onMarkerLoad = (marker) => {
    _logger("marker: ", marker);
  };

  return (
    <React.Fragment>
      <br />
      <div className="container text-center">
        <div className="row">
          {/* <LoadScript
            googleMapsApiKey={GOOGLE_AUTOCOMPLTE_APIKEY}
            libraries={libraries}
          > */}
          {isLoaded && (
            <div className="col">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={latLngMarker}
                zoom={latLngMarker.zoom}
              >
                <MarkerF
                  title="LineOne"
                  position={latLngMarker}
                  animation="drop"
                  visible={true}
                  onLoad={onMarkerLoad}
                ></MarkerF>
              </GoogleMap>
            </div>
          )}

          <div className="col">
            <Formik
              enableReinitialize={true}
              initialValues={addressFormData}
              validationSchema={locationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="col-9 form-control-lg">
                <Row className="col-md-12">
                  <label
                    htmlFor="lineOne"
                    className="form-label text-white-50 bg-dark"
                  >
                    Line One
                  </label>
                  {isLoaded && (
                    <AutocompleteTemplate
                      className="lineOne p-0 m-0"
                      options={autoCompleteConfig}
                      onPlaceChanged={onPlaceChanged}
                      onLoad={onLoad}
                    >
                      <Field
                        type="text"
                        name="lineOne"
                        className="form-control"
                      ></Field>
                    </AutocompleteTemplate>
                  )}

                  <ErrorMessage name="lineOne" component="div" />
                </Row>
                <br />
                <Row className="col-md-12">
                  <label
                    htmlFor="lineTwo"
                    className="form-label text-white-50 bg-dark"
                  >
                    Line Two
                  </label>
                  <Field
                    type="text"
                    name="lineTwo"
                    className="form-control"
                  ></Field>
                  <ErrorMessage name="lineTwo" component="div" />
                </Row>
                <br />
                <Row className="col-md-12">
                  <label
                    htmlFor="city"
                    className="form-label text-white-50 bg-dark"
                  >
                    City
                  </label>
                  <Field
                    type="text"
                    name="city"
                    className="form-control"
                  ></Field>
                  <ErrorMessage name="city" component="div" />
                </Row>
                <br />
                <Row className="col-md-12">
                  <label
                    htmlFor="zip"
                    className="form-label text-white-50 bg-dark"
                  >
                    Zip
                  </label>
                  <Field
                    type="text"
                    name="zip"
                    className="form-control"
                  ></Field>
                  <ErrorMessage name="zip" component="div" />
                </Row>
                <br />
                <Row className="col-md-12">
                  <label
                    htmlFor="stateId"
                    className="form-label text-white-50 bg-dark"
                  >
                    State
                  </label>
                  <Field
                    component="select"
                    name="stateId"
                    className="form-control"
                  >
                    <option value="">Please select a State</option>
                    {lookUpData.stateComponent}
                  </Field>
                  <ErrorMessage name="stateId" component="div" />
                </Row>
                <br />
                <Row className="col-md-12">
                  <label
                    htmlFor="location"
                    className="form-label text-white-50 bg-dark"
                  >
                    Location Type
                  </label>
                  <Field
                    component="select"
                    name="locationTypeId"
                    className="form-control"
                  >
                    <option value="">Please select a location</option>
                    {lookUpData.locationComponent}
                  </Field>
                  <ErrorMessage name="locationTypeId" component="div" />
                </Row>
                <br />
                <Row className="col-md-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    id="update"
                    name="update"
                  >
                    {addressFormData.id ? "Update Address" : "Add Address"}
                  </button>
                </Row>
              </Form>
            </Formik>
          </div>
          {/* </LoadScript> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default LocationForm;
