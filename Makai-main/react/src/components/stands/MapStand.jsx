import React, { useState, useRef, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import debug from "sabio-debug";
import { Col, Container, Row, Card, ListGroup, Button } from "react-bootstrap";
const _logger = debug.extend("StandMap");
const GOOGLE_AUTOCOMPLTE_APIKEY = process.env.REACT_APP_GOOGLE_AUTO_COMPLETE;
const libraries = ["places"];
import "./stands.css";

function MapStand(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_AUTOCOMPLTE_APIKEY,
    libraries: libraries,
  });

  const origin = useRef(null);

  const [toggle, setToggle] = useState(false);

  const [originInput, setOriginInput] = useState("");

  const [defaultValues, setDefaultValues] = useState({
    standInfo: props,
    destination: "",
    origin: "",
    mapCenter: "",
    travelMode: "DRIVING",
    response: "",
    allDirections: [],
    containerStyle: {
      width: "700px",
      height: "550px",
    },
    showRoutes: true,
    showMarker: true,
    showDirections: false,
    autocomplete: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setDefaultValues((prevState) => {
        const newState = { ...prevState };
        newState.origin = {
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude),
        };
        newState.destination =
          defaultValues.standInfo.stand.location.lineOne +
          defaultValues.standInfo.stand.location.lineTwo;
        newState.mapCenter = {
          lat: defaultValues.standInfo.stand.location.latitude,
          lng: defaultValues.standInfo.stand.location.longitude,
        };
        return newState;
      });
    });
  }, []);

  const handleClick = () => {
    setDefaultValues((prevState) => {
      const newState = { ...prevState };
      newState.showRoutes = true;
      newState.showMarker = false;
      newState.origin = origin.current.value;
      return newState;
    });
    setOriginInput("");
  };
  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDefaultValues((prevState) => {
          let newState = { ...prevState };
          newState.response = response;
          newState.showRoutes = false;
          newState.allDirections = response.routes[0].legs[0].steps;
          return newState;
        });
      } else {
        _logger("response: ", response);
      }
    }
  };

  const getSteps = () => {
    setToggle(!toggle);

    setDefaultValues((prevState) => {
      const newState = { ...prevState };
      newState.showDirections = true;
      newState.containerStyle = {
        width: "700px",
        height: "550px",
      };
      return newState;
    });
  };

  const mapInstructions = (inst, index) => {
    const distanceInMiles = (inst.distance.value / 1609.34).toFixed(2);
    return (
      <ListGroup.Item key={index}>
        <Row>
          <Col md="8">
            <li>
              <div dangerouslySetInnerHTML={{ __html: inst.instructions }} />
            </li>
          </Col>
          <Col md="4">
            <div className="step-distance">{distanceInMiles} miles</div>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  const onPrint = () => {
    const printWindow = window.open(
      "",
      "Print Directions",
      "height=600,width=800"
    );

    const stepsHtml = defaultValues.allDirections
      .map((step, index) => {
        return `<div>${index + 1}. ${step.instructions}</div>`;
      })
      .join("");

    printWindow.document.write(`<html><body>${stepsHtml}</body></html>`);

    printWindow.print();
  };

  const handleInputChange = (event) => {
    setOriginInput(event.target.value);
  };

  const mappedDirections = defaultValues.allDirections.map(mapInstructions);

  return (
    <>
      <Container>
        <Row className="stand-toolbar justify-content-center mb-2">
          <Col md="6" className="text-white my-auto">
            {isLoaded && (
              <Autocomplete>
                <input
                  className="form-control"
                  placeholder="Enter your current location"
                  id="origin"
                  type="text"
                  ref={origin}
                  value={originInput}
                  onChange={handleInputChange}
                />
              </Autocomplete>
            )}
          </Col>
          <Col md="3" className="my-auto">
            <button
              className="btn btn-primary text-white justify-content-center"
              onClick={handleClick}
              disabled={!originInput}
            >
              Search Location
            </button>
          </Col>
          <Col md="3" className="my-auto">
            <button
              type="button"
              className="btn btn-warning text-white justify-content-center"
              onClick={getSteps}
            >
              {toggle ? "Hide Directions" : "Show Directions"}
            </button>
          </Col>
        </Row>

        <Row className="justify-content-center flexbox">
          <Col md="6">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={defaultValues.containerStyle}
                center={defaultValues.mapCenter}
                zoom={12}
                id="map"
              >
                {defaultValues.showRoutes && (
                  <DirectionsService
                    options={{
                      destination: defaultValues.destination,
                      origin: defaultValues.origin,
                      travelMode: defaultValues.travelMode,
                    }}
                    callback={directionsCallback}
                  />
                )}
                {defaultValues.response !== "" && (
                  <DirectionsRenderer
                    options={{
                      directions: defaultValues.response,
                    }}
                  />
                )}
                {defaultValues.showMarker && (
                  <Marker position={defaultValues.mapCenter} label="Stand" />
                )}
              </GoogleMap>
            )}
          </Col>
          {toggle && defaultValues.showDirections && (
            <Col>
              <Card className="card-size">
                <Card.Body>
                  <Card.Img
                    src={defaultValues.standInfo.stand.partner.logo}
                    className="stand-image-card"
                  />
                </Card.Body>
                <Card.Body scroll="true">
                  <Button variant="dark" onClick={onPrint}>
                    Print Steps
                  </Button>
                </Card.Body>

                <ol>
                  <ListGroup className="list-group-flush px-4 stand-list-group">
                    {mappedDirections}
                  </ListGroup>
                </ol>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default MapStand;
